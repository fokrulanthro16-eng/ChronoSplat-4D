const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

async function runPipeline() {
  console.log('=== STEP 1: CAPTURING 5 HIGH-RES SCREENSHOTS ===');
  const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
  const publicDir = path.join(__dirname, '..', 'public');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

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

  console.log('Connecting to http://localhost:3000...');
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Allow animations, fonts, and Three.js canvas to settle
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 1. Full 3-Panel Overview
  console.log('Capturing 01_hero_overview.png...');
  await page.screenshot({
    path: path.join(screenshotsDir, '01_hero_overview.png'),
  });

  // Query hero panels
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

  if (panelBBoxes.length >= 3) {
    // 2. Left Panel: Volumetric Core
    console.log('Capturing 02_volumetric_core.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '02_volumetric_core.png'),
      clip: panelBBoxes[0],
    });

    // 3. Center Panel: Hand Tracking Rig (Zero Controllers)
    console.log('Capturing 03_hand_rig.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '03_hand_rig.png'),
      clip: panelBBoxes[1],
    });

    // 4. Right Panel: Dual-LLM Copilot Badge
    console.log('Capturing 04_dual_llm_copilot.png...');
    await page.screenshot({
      path: path.join(screenshotsDir, '04_dual_llm_copilot.png'),
      clip: panelBBoxes[2],
    });
  }

  // 5. Bottom Gesture Deck & Benchmark Matrix
  console.log('Capturing 05_benchmark_deck.png...');
  const bottomClip = await page.evaluate(() => {
    const mainChildren = Array.from(document.querySelector('main').children).filter(
      (c) => c.tagName !== 'DIV' || !c.classList.contains('hidden')
    );
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
      path: path.join(screenshotsDir, '05_benchmark_deck.png'),
      clip: bottomClip,
    });
  } else {
    await page.screenshot({
      path: path.join(screenshotsDir, '05_benchmark_deck.png'),
    });
  }

  await browser.close();
  console.log('✓ All 5 screenshots saved in docs/screenshots/');

  console.log('\n=== STEP 2: SYNTHESIZING SOPHISTICATED NEURAL VOICEOVER ===');
  const narrationScript =
    "For over a decade, virtual reality cinema locked users behind flat screens with zero motion parallax. ChronoSplat 4D changes everything: a hands-first, 6DoF volumetric cinema engine built natively on the WebXR Device API for Meta Quest 3. Zero installations. Zero plastic controllers. Enter WebXR to experience true 4D Gaussian Splatting at locked 90 frames per second. Control the spatial studio purely through air-pinch temporal scrubbers, bimanual diorama-to-IMAX scaling, and contactless binaural audio snapping. Backed by a dual-LLM copilot featuring Google Gemini 1.5 Flash with instant NVIDIA Nemotron failover, ChronoSplat 4D brings Hollywood-grade spatial direction to the open web.";

  const audioPath = path.join(publicDir, 'demo_voiceover.mp3');
  console.log('Calling edge-tts (voice: en-US-ChristopherNeural)...');
  const ttsCmd = `python -m edge_tts --voice "en-US-ChristopherNeural" --text "${narrationScript}" --write-media "${audioPath}"`;
  execSync(ttsCmd, { stdio: 'inherit' });
  console.log('✓ Synthesized demo_voiceover.mp3');

  console.log('\n=== STEP 3: RENDERING MASTER MP4 DEMO VIDEO ===');
  // Determine audio duration via ffmpeg
  const probeResult = spawnSync(ffmpegPath, ['-i', audioPath], { encoding: 'utf-8' });
  const probeOutput = probeResult.stderr || probeResult.stdout || '';
  const durMatch = probeOutput.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);

  let totalDuration = 27.5;
  if (durMatch) {
    totalDuration =
      parseFloat(durMatch[1]) * 3600 +
      parseFloat(durMatch[2]) * 60 +
      parseFloat(durMatch[3]);
  }
  console.log(`Audio Duration: ${totalDuration.toFixed(2)} seconds`);

  const slideDuration = (totalDuration / 5).toFixed(2);
  console.log(`Per-slide duration: ${slideDuration}s`);

  // Build Concat file for FFmpeg
  const slide1 = path.join(screenshotsDir, '01_hero_overview.png').replace(/\\/g, '/');
  const slide2 = path.join(screenshotsDir, '02_volumetric_core.png').replace(/\\/g, '/');
  const slide3 = path.join(screenshotsDir, '03_hand_rig.png').replace(/\\/g, '/');
  const slide4 = path.join(screenshotsDir, '04_dual_llm_copilot.png').replace(/\\/g, '/');
  const slide5 = path.join(screenshotsDir, '05_benchmark_deck.png').replace(/\\/g, '/');

  const concatContent = [
    `file '${slide1}'`,
    `duration ${slideDuration}`,
    `file '${slide2}'`,
    `duration ${slideDuration}`,
    `file '${slide3}'`,
    `duration ${slideDuration}`,
    `file '${slide4}'`,
    `duration ${slideDuration}`,
    `file '${slide5}'`,
    `duration ${slideDuration}`,
    `file '${slide5}'`,
  ].join('\n');

  const concatFilePath = path.join(screenshotsDir, 'concat_list.txt');
  fs.writeFileSync(concatFilePath, concatContent, 'utf-8');

  const videoOutputPath = path.join(publicDir, 'chronosplat_4d_demo.mp4');

  const ffmpegArgs = [
    '-f', 'concat',
    '-safe', '0',
    '-i', concatFilePath,
    '-i', audioPath,
    '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x06070d,format=yuv420p',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-r', '30',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    '-y',
    videoOutputPath,
  ];

  console.log(`Executing FFmpeg video render -> ${videoOutputPath}...`);
  const renderResult = spawnSync(ffmpegPath, ffmpegArgs, { stdio: 'inherit' });

  if (renderResult.status !== 0) {
    throw new Error(`FFmpeg failed with exit code ${renderResult.status}`);
  }

  // Remove temporary concat list
  if (fs.existsSync(concatFilePath)) {
    fs.unlinkSync(concatFilePath);
  }

  const stat = fs.statSync(videoOutputPath);
  console.log(`✓ Master MP4 demo video created successfully! (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
  console.log('=== PIPELINE COMPLETE ===');
}

runPipeline().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
