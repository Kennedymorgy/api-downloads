const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Pega a URL enviada (que ja e a da 3ª etapa)
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'URL da pagina final nao informada!' });
  }

  let browser = null;

  try {
    // Inicia o navegador invisivel na Vercel
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Emula um navegador Android real para nao travar no Cloudflare
    await page.setUserAgent(
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    );

    // Entra DIRETO na pagina final (3ª etapa)
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Aguarda carregar o conteudo do botao
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    // Extrai o link direto do arquivo .apk dentro do botao verde "Download (198 MB)"
    let apkDirectUrl = $('a[href*=".apk"]').attr('href') || 
                       $('a[download]').attr('href') || 
                       $('.download-button').attr('href') ||
                       $('a.btn-download').attr('href');

    await browser.close();

    if (apkDirectUrl) {
      if (!apkDirectUrl.startsWith('http')) {
        apkDirectUrl = 'https://liteapks.com' + apkDirectUrl;
      }
      
      // Retorna APENAS a URL do arquivo .apk em texto puro
      // O seu script no tema vai usar isso para baixar na hora sem mudar de pagina
      return res.status(200).send(apkDirectUrl);
    } else {
      return res.status(404).json({ success: false, error: 'Botao de download nao encontrado na pagina.' });
    }

  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).json({ success: false, error: 'Erro ao processar: ' + error.message });
  }
};
