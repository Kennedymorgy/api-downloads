const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL do jogo nao informada!');
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://liteapks.com/'
    };

    // 1. Acessa a pagina inicial do jogo
    const resp1 = await axios.get(targetUrl, { headers });
    const $1 = cheerio.load(resp1.data);
    let step2 = $1('a[href*="/download/"]').attr('href') || $1('a.btn-download').attr('href');

    if (!step2) return res.status(404).send('Etapa 1 falhou.');
    if (!step2.startsWith('http')) step2 = 'https://liteapks.com' + step2;

    // 2. Acessa a pagina intermediaria
    const resp2 = await axios.get(step2, { headers });
    const $2 = cheerio.load(resp2.data);
    let step3 = $2('a[href*="/download/"]').attr('href') || $2('.download-list a').attr('href');

    if (!step3) step3 = step2; // Caso ja seja a pagina final
    if (!step3.startsWith('http')) step3 = 'https://liteapks.com' + step3;

    // 3. Acessa a pagina FINAL (a da imagem que voce mandou)
    const resp3 = await axios.get(step3, { headers });
    const $3 = cheerio.load(resp3.data);

    // Pega o link real do botao verde de download
    let apkDirectUrl = $3('a[href*=".apk"]').attr('href') || 
                       $3('a[download]').attr('href') || 
                       $3('a.download-button').attr('href') ||
                       $3('.entry-download a').attr('href');

    if (apkDirectUrl) {
      if (!apkDirectUrl.startsWith('http')) {
        apkDirectUrl = 'https://liteapks.com' + apkDirectUrl;
      }
      
      // Em vez de dar res.redirect (que muda a pagina do site),
      // enviamos o link direto para o script do seu tema baixar em segundo plano!
      return res.status(200).send(apkDirectUrl);
    } else {
      // Se nao achar o link direto do APK, retorna a pagina final para o script processar
      return res.status(200).send(step3);
    }

  } catch (error) {
    return res.status(500).send('Erro: ' + error.message);
  }
};
