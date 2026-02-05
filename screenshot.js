const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to standard desktop size
  await page.setViewportSize({ width: 1400, height: 900 });

  // Load the local HTML file
  const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Take initial screenshot
  await page.screenshot({ path: 'screenshot-initial.png' });
  console.log('Initial screenshot saved');

  // Scroll to middle of page
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-scrolled.png' });
  console.log('Scrolled screenshot saved');

  // Scroll further down
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-scrolled-more.png' });
  console.log('Further scrolled screenshot saved');

  await browser.close();
})();
