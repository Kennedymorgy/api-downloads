const axios = require('axios');

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

    const resposta = await axios.get(targetUrl, {
      timeout: 15000,
      maxRedirects: 5,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',

        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',

        'Accept-Language': 'en-US,en;q=0.9'
      },

      // IMPORTANTE: não deixa o Axios transformar 403 em erro
      validateStatus: () => true
    });

    const html =
      typeof resposta.data === 'string'
        ? resposta.data
        : JSON.stringify(resposta.data);

    return res.status(200).json({
      status: resposta.status,
      server: resposta.headers.server || null,
      contentType: resposta.headers['content-type'] || null,
      tamanho: html.length,

      // Só primeiros 2000 caracteres
      resposta: html.substring(0, 2000)
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
