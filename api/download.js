const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL do jogo nao informada!');
  }

  try {
    // 1. Acessa a pagina principal do jogo no LiteAPKs
    const response1 = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $1 = cheerio.load(response1.data);
    let downloadPageLink = $1('a[href*="/download/"]').attr('href') || $1('a.btn-download').attr('href');

    if (!downloadPageLink) {
      return res.status(444).send('Pagina de download nao encontrada.');
    }

    if (!downloadPageLink.startsWith('http')) {
      downloadPageLink = 'https://liteapks.com' + downloadPageLink;
    }

    // 2. Acessa a pagina intermediaria para pegar o link final do arquivo
    const response2 = await axios.get(downloadPageLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $2 = cheerio.load(response2.data);
    
    // Procura o link direto de download do APK
    let directApkLink = $2('a[href*=".apk"]').attr('href') || 
                        $2('a[download]').attr('href') || 
                        $2('.download-list a').attr('href');

    if (directApkLink) {
      if (!directApkLink.startsWith('http')) {
        directApkLink = 'https://liteapks.com' + directApkLink;
      }
      return res.redirect(302, directApkLink);
    } else {
      return res.redirect(302, downloadPageLink);
    }

  } catch (error) {
    return res.status(500).send('Erro ao buscar o link direto: ' + error.message);
  }
};
