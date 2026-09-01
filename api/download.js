const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL do jogo nao informada!');
  }

  try {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';

    // 1. Acessa a pagina principal do jogo
    const response1 = await axios.get(targetUrl, {
      headers: { 'User-Agent': userAgent }
    });

    const $1 = cheerio.load(response1.data);
    let downloadPageLink = $1('a[href*="/download/"]').attr('href') || $1('a.btn-download').attr('href');

    if (!downloadPageLink) {
      return res.status(444).send('Pagina de download nao encontrada.');
    }

    if (!downloadPageLink.startsWith('http')) {
      downloadPageLink = 'https://liteapks.com' + downloadPageLink;
    }

    // 2. Acessa a pagina interna onde fica o botao do arquivo .apk
    const response2 = await axios.get(downloadPageLink, {
      headers: { 'User-Agent': userAgent }
    });

    const $2 = cheerio.load(response2.data);

    // Procura o link que contem o arquivo final (.apk ou link de download direto)
    let finalApkUrl = $2('a[href*=".apk"]').attr('href') || 
                      $2('a.download-button').attr('href') || 
                      $2('a[href*="file"]').attr('href') || 
                      $2('.entry-download a').attr('href');

    if (!finalApkUrl) {
      // Pega o primeiro link dentro do bloco de versoes/botoes de download
      finalApkUrl = $2('.download-list a, .download-box a, a.btn').first().attr('href');
    }

    if (finalApkUrl) {
      if (!finalApkUrl.startsWith('http')) {
        finalApkUrl = 'https://liteapks.com' + finalApkUrl;
      }
      // Redireciona diretamente para o arquivo (dispara o download imediato no celular)
      return res.redirect(302, finalApkUrl);
    } else {
      return res.status(404).send('Link direto do APK nao encontrado.');
    }

  } catch (error) {
    return res.status(500).send('Erro ao processar download: ' + error.message);
  }
};
