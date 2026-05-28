const puppeteer = require('puppeteer-core');

(async () => {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Listen for console errors
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`PAGE EXCEPTION: ${err.stack || err.toString()}`);
  });

  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText || 'Unknown'}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`RESPONSE ERROR: ${response.url()} status ${response.status()}`);
    }
  });

  console.log("Navigating to http://localhost:3005/#/demo ...");
  await page.goto('http://localhost:3005/#/demo', { waitUntil: 'networkidle0' });

  console.log("Waiting 3 seconds...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get the rendered text in the error box if present
  const errorBoxText = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const errorDiv = divs.find(d => d.textContent.includes('Error técnico:'));
    return errorDiv ? errorDiv.textContent : null;
  });

  if (errorBoxText) {
    console.log(`FOUND ERROR ON PAGE: ${errorBoxText.trim()}`);
  } else {
    console.log("No error box found on page.");
  }

  await browser.close();
  console.log("Done!");
})();
