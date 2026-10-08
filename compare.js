const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// Renders animated.html and places it beside design/mockup.jpg at the same scale,
// so layout, spacing and colour differences are easy to spot.
const PAGE = path.join(__dirname, 'animated.html');
const MOCKUP = path.join(__dirname, 'design', 'mockup.jpg');
const OUT = path.join(__dirname, 'compare.png');
const WIDTH = 1440;

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: 900 });

  // Reduced motion makes the page skip its intro and scroll animations,
  // so the full-page capture shows every section in its final state.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const site = await page.screenshot({ fullPage: true, encoding: 'base64' });
  const siteHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  console.log('Composing side-by-side...');
  const mockup = fs.readFileSync(MOCKUP).toString('base64');
  const col = 720;
  await page.setViewport({ width: col * 2 + 48, height: 900 });
  await page.emulateMediaFeatures([]);
  await page.setContent(`
    <body style="margin:0;background:#1e2920;font:600 14px system-ui;color:#fff">
      <div style="display:flex;gap:16px;padding:16px;align-items:flex-start">
        <figure style="margin:0;width:${col}px">
          <figcaption style="padding:0 0 8px">Mockup</figcaption>
          <img src="data:image/jpeg;base64,${mockup}" style="width:100%;display:block">
        </figure>
        <figure style="margin:0;width:${col}px">
          <figcaption style="padding:0 0 8px">animated.html @ ${WIDTH}px (${siteHeight}px tall)</figcaption>
          <img src="data:image/png;base64,${site}" style="width:100%;display:block">
        </figure>
      </div>
    </body>`, { waitUntil: 'load' });
  await page.screenshot({ path: OUT, fullPage: true });

  await browser.close();
  console.log('Done! Comparison saved as compare.png');
})();
