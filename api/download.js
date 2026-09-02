const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Permite acesso de qualquer origem (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'URL da página não informada.' });
  }

  try {
    // Faz a requisição simulando um navegador comum
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://modyolo.com/'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Busca o link que termina em .apk ou que aponta para files.modyolo.com
    let downloadUrl = $('a[href*=".apk"]').attr('href') || 
                      $('a[href*="files.modyolo.com"]').attr('href') ||
                      $('a#download-button').attr('href');

    if (!downloadUrl) {
      // Procura qualquer link dentro da área de download principal caso os seletores acima falhem
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && (href.includes('.apk') || href.includes('files.modyolo.com'))) {
          downloadUrl = href;
          return false; // Interrompe o loop
        }
      });
    }

    if (downloadUrl) {
      // Redireciona o visitante diretamente para o arquivo de download (.apk)
      return res.redirect(302, downloadUrl);
    } else {
      return res.status(404).json({ success: false, error: 'Botão de download não encontrado na página.' });
    }

  } catch (error) {
    console.error('Erro no scraper:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao acessar o Modyolo: ' + error.message 
    });
  }
};
