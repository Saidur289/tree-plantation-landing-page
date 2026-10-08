const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Match the target viewport width
  // A normal-height viewport, so the page can scroll far enough to fire every ScrollTrigger
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to local server...');
  await page.goto('http://localhost:8080/animated.html', {
    waitUntil: 'networkidle0',
  });
  
  console.log('Waiting for initial animations to settle...');
  await new Promise(r => setTimeout(r, 2000));
  
  // Scroll down smoothly to trigger all ScrollTrigger animations
  console.log('Scrolling down to trigger scroll animations...');
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              
              if(totalHeight >= scrollHeight - window.innerHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
  
  // Wait for all GSAP stagger animations to finish after scrolling
  await new Promise(r => setTimeout(r, 2000));

  // Scroll back to top for the full page screenshot if needed, 
  // but fullPage screenshot handles this automatically.
  
  console.log('Capturing screenshot...');
  await page.screenshot({ path: 'screenshot-animated.png', fullPage: true });
  
  await browser.close();
  console.log('Done! Screenshot saved as screenshot-animated.png');
})();
