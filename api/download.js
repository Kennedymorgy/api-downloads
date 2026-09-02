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
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://liteapks.com/'
      },

      validateStatus: () => true
    });

    return res.status(200).json({
      success: true,
      statusDoLiteAPKs: resposta.status,
      urlFinal: resposta.request?.res?.responseUrl || targetUrl,
      contentType: resposta.headers['content-type'] || null,
      tamanhoResposta: resposta.data
        ? String(resposta.data).length
        : 0,

      inicioHTML:
        typeof resposta.data === 'string'
          ? resposta.data.substring(0, 1000)
          : 'Resposta não é HTML'
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      erro: error.message,
      codigo: error.code || null
    });
  }
};
