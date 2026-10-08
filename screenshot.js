const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Match the target viewport width
  await page.setViewport({ width: 1440, height: 1080 });
  
  console.log('Navigating to local server...');
  await page.goto('http://localhost:8080/index.html', {
    waitUntil: 'networkidle0',
  });
  
  console.log('Waiting for images to fully load...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Capturing screenshot...');
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  await browser.close();
  console.log('Done! Screenshot saved as screenshot.png');
})();
