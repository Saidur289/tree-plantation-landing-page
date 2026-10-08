const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// Captures animated.html on common devices and reports anything wider than the screen.
// Output: screenshots/responsive/<device>.png
const PAGE = pathToFileURL(path.join(__dirname, 'animated.html')).href;
const OUT_DIR = path.join(__dirname, 'screenshots', 'responsive');
const DEVICES = [
  // name, width, height, touch device?
  ['phone-small', 320, 568, true],
  ['phone', 390, 844, true],
  ['phone-large', 430, 932, true],
  ['phone-landscape', 844, 390, true],
  ['tablet', 768, 1024, true],
  ['tablet-landscape', 1024, 768, true],
  ['laptop', 1280, 800, false],
  ['desktop', 1440, 900, false],
  ['full-hd', 1920, 1080, false],
  ['4k', 2560, 1440, false],
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch();
  let problems = 0;

  for (const [name, width, height, touch] of DEVICES) {
    const page = await browser.newPage();
    page.on('pageerror', err => { problems++; console.log(`  ${name}: page error: ${err.message}`); });
    await page.setViewport({ width, height, isMobile: touch, hasTouch: touch });
    // Reduced motion shows every section in its final, fully revealed state.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(PAGE, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 0) { problems++; console.log(`  ${name}: page is ${overflow}px wider than the screen`); }

    await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: true });
    console.log(`${name} (${width}x${height}) ${overflow > 0 ? 'OVERFLOW' : 'ok'}`);
    await page.close();
  }

  await browser.close();
  console.log(problems ? `Done with ${problems} problem(s).` : 'Done! No problems found.');
  console.log(`Screenshots saved in ${path.relative(__dirname, OUT_DIR)}`);
})();
