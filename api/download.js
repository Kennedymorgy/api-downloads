const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('URL do jogo nao informada!');
  }

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    let downloadLink = $('a[href*="/download/"]').attr('href') || $('a.btn-download').attr('href');

    if (downloadLink) {
      if (!downloadLink.startsWith('http')) {
        downloadLink = 'https://liteapks.com' + downloadLink;
      }
      return res.redirect(302, downloadLink);
    } else {
      return res.status(444).send('Botao de download nao encontrado.');
    }
  } catch (error) {
    return res.status(500).send('Erro na requisição: ' + error.message);
  }
};
