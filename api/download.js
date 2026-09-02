const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Libera o CORS para seu site conversar com a Vercel sem bloqueios
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL nao informada');
  }

  try {
    // Faz a requisicao HTTP ultra-rapida direto na 3ª etapa
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 5000 // Cancela se demorar mais de 5 segundos
    });

    const $ = cheerio.load(response.data);

    // Extrai o link direto do arquivo .apk dentro do botao verde
    let apkDirectUrl = $('a[href*=".apk"]').attr('href') || 
                       $('a[download]').attr('href') || 
                       $('.download-button').attr('href') ||
                       $('a.btn-download').attr('href');

    if (apkDirectUrl) {
      if (!apkDirectUrl.startsWith('http')) {
        apkDirectUrl = 'https://liteapks.com' + apkDirectUrl;
      }
      // Devolve o link do arquivo .apk em menos de 1 segundo!
      return res.status(200).send(apkDirectUrl.trim());
    } else {
      return res.status(404).send('Botao .apk nao encontrado na pagina');
    }

  } catch (error) {
    return res.status(500).send('Erro na Vercel: ' + error.message);
  }
};
