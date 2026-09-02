const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'URL do jogo nao informada!' });
  }

  let browser = null;

  try {
    // Inicia o navegador Chromium leve configurado para Serverless/Vercel
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Define um User-Agent real de celular Android
    await page.setUserAgent(
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    );

    // ETAPA 1: Acessa a pagina do jogo
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    let htmlContent = await page.content();
    let $ = cheerio.load(htmlContent);

    let step2Url = $('a[href*="/download/"]').attr('href') || $('a.btn-download').attr('href');
    if (!step2Url) {
      await browser.close();
      return res.status(404).json({ success: false, error: 'Etapa 1: Link de download nao encontrado.' });
    }
    if (!step2Url.startsWith('http')) step2Url = 'https://liteapks.com' + step2Url;

    // ETAPA 2: Navega ate a pagina intermediaria/final de download
    await page.goto(step2Url, { waitUntil: 'networkidle2', timeout: 20000 });
    htmlContent = await page.content();
    $ = cheerio.load(htmlContent);

    // Se houver mais uma subpágina, clica/navega para ela
    let step3Url = $('a[href*="/download/"]').attr('href') || $('.download-list a').attr('href');
    if (step3Url && !step3Url.startsWith('http')) step3Url = 'https://liteapks.com' + step3Url;

    if (step3Url && step3Url !== step2Url) {
      await page.goto(step3Url, { waitUntil: 'networkidle2', timeout: 20000 });
      htmlContent = await page.content();
      $ = cheerio.load(htmlContent);
    }

    // Procura o botão verde / link final direto do arquivo .apk
    let apkDirectUrl = $('a[href*=".apk"]').attr('href') || 
                       $('a[download]').attr('href') || 
                       $('a.download-button').attr('href') ||
                       $('.entry-download a').attr('href');

    await browser.close();

    if (apkDirectUrl) {
      if (!apkDirectUrl.startsWith('http')) {
        apkDirectUrl = 'https://liteapks.com' + apkDirectUrl;
      }
      // Retorna o link direto do arquivo .apk para o script do seu site baixar
      return res.status(200).send(apkDirectUrl);
    } else {
      // Caso nao encontre o .apk, retorna a URL da página final carregada
      return res.status(200).send(step3Url || step2Url);
    }

  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).json({ success: false, error: 'Erro Puppeteer: ' + error.message });
  }
};
