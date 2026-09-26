const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching headless browser with 1920x1080 viewport...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Let UI, animations, fonts, and Three.js canvas settle
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 1. Full Desktop Hero Overview
  console.log('Capturing 01_hero_overview.png...');
  await page.screenshot({
    path: path.join(screenshotsDir, '01_hero_overview.png'),
  });

  // Query the 3 spatial hero panels
  const panelBBoxes = await page.$$eval(
    'div[class*="grid-cols-1"][class*="lg:grid-cols-3"] > div.rounded-3xl',
    (cards) =>
      cards.map((c) => {
        const r = c.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      })
  );

  console.log(`Found ${panelBBoxes.length} hero panel bounding boxes.`);

  if (panelBBoxes.length >= 3) {
    // 2. Focused Volumetric Core (Left Panel)
    console.log('Capturing 02_volumetric_core.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '02_volumetric_core.png'),
      clip: panelBBoxes[0],
    });

    // 3. Focused Hand Tracking Rig (Center Panel)
    console.log('Capturing 03_hand_tracking_rig.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '03_hand_tracking_rig.png'),
      clip: panelBBoxes[1],
    });

    // 4. Focused Spatial Acoustics & Dual-LLM Copilot (Right Panel)
    console.log('Capturing 04_dual_llm_copilot.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '04_dual_llm_copilot.png'),
      clip: panelBBoxes[2],
    });
  }

  // 5. Focused Architecture Benchmark & Seated Gesture Deck
  console.log('Capturing 05_architecture_benchmark.png...');
  const bottomClip = await page.evaluate(() => {
    const mainChildren = Array.from(document.querySelector('main').children).filter(c => c.tagName !== 'DIV' || !c.classList.contains('hidden'));
    // The gesture deck and benchmark are the last two children
    const gestureDeck = mainChildren[mainChildren.length - 2];
    const benchmark = mainChildren[mainChildren.length - 1];
    if (gestureDeck && benchmark) {
      const gRect = gestureDeck.getBoundingClientRect();
      const bRect = benchmark.getBoundingClientRect();
      return {
        x: Math.round(Math.max(0, gRect.x - 20)),
        y: Math.round(Math.max(0, gRect.y - 15)),
        width: Math.round(gRect.width + 40),
        height: Math.round(bRect.bottom - gRect.top + 30),
      };
    }
    return null;
  });

  if (bottomClip) {
    await page.screenshot({
      path: path.join(screenshotsDir, '05_architecture_benchmark.png'),
      clip: bottomClip,
    });
  } else {
    await page.screenshot({
      path: path.join(screenshotsDir, '05_architecture_benchmark.png'),
    });
  }

  await browser.close();
  console.log('All 5 Ultra-HD screenshots captured and verified successfully!');
}

captureScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
