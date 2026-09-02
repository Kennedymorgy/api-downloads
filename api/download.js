const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL do jogo nao informada!');
  }

  try {
    // Simulacao completa de navegador para evitar o bloqueio 403 da Cloudflare
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://liteapks.com/'
    };

    // ETAPA 1: Pega a pagina principal do jogo
    const response1 = await axios.get(targetUrl, { headers });
    const $1 = cheerio.load(response1.data);
    let downloadPage = $1('a[href*="/download/"]').attr('href') || $1('a.btn-download').attr('href');

    if (!downloadPage) {
      return res.status(404).send('Pagina de download nao encontrada.');
    }

    if (!downloadPage.startsWith('http')) {
      downloadPage = 'https://liteapks.com' + downloadPage;
    }

    // ETAPA 2: Redireciona o navegador para a tela final onde o arquivo do APK é disparado
    return res.redirect(302, downloadPage);

  } catch (error) {
    return res.status(500).send('Erro ao buscar link: ' + error.message);
  }
};
