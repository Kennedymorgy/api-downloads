const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      error: 'URL do jogo não informada'
    });
  }

  try {

    const parsedUrl = new URL(targetUrl);

    if (
      parsedUrl.hostname !== 'liteapks.com' &&
      parsedUrl.hostname !== 'www.liteapks.com'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Domínio não permitido'
      });
    }

    const response = await axios.get(targetUrl, {

      timeout: 20000,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',

        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',

        'Accept-Language':
          'en-US,en;q=0.9',

        'Referer':
          'https://liteapks.com/'
      },

      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);

    const links = [];

    $('a').each((i, element) => {

      const href = $(element).attr('href');

      const text = $(element)
        .text()
        .replace(/\s+/g, ' ')
        .trim();

      if (href) {

        links.push({
          texto: text,
          href: href
        });

      }

    });

    return res.status(200).json({

      success: true,

      pagina: targetUrl,

      totalLinks: links.length,

      links: links

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      error: error.message

    });

  }

};
