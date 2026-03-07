/**
 * Generate OG social card image for SmartPMO Prompts
 * Uses sharp to render SVG → PNG at 1200×630
 * Run: node website/prompts/generate-og.js
 */
const sharp = require('sharp');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

// Use system fonts available on Windows
const FONT = 'Segoe UI, Arial, sans-serif';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="40%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0"/>
      <stop offset="15%" stop-color="#06B6D4" stop-opacity="0.5"/>
      <stop offset="85%" stop-color="#a78bfa" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Top/bottom accent bars -->
  <rect x="0" y="0" width="${WIDTH}" height="4" fill="url(#titleGrad)"/>
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="url(#titleGrad)"/>

  <!-- Diamond decorations (subtle) -->
  <g opacity="0.12">
    <path d="M0 -24 Q8 -8 24 0 Q8 8 0 24 Q-8 8 -24 0 Q-8 -8 0 -24 Z" fill="#06B6D4" transform="translate(160, 170)"/>
    <path d="M0 -18 Q6 -6 18 0 Q6 6 0 18 Q-6 6 -18 0 Q-6 -6 0 -18 Z" fill="#a78bfa" transform="translate(1040, 460)"/>
    <path d="M0 -14 Q5 -5 14 0 Q5 5 0 14 Q-5 5 -14 0 Q-5 -5 0 -14 Z" fill="#00F5FF" transform="translate(980, 140)"/>
    <path d="M0 -10 Q3 -3 10 0 Q3 3 0 10 Q-3 3 -10 0 Q-3 -3 0 -10 Z" fill="#4C78FF" transform="translate(220, 480)"/>
    <path d="M0 -8 Q3 -3 8 0 Q3 3 0 8 Q-3 3 -8 0 Q-3 -3 0 -8 Z" fill="#06B6D4" transform="translate(870, 520)"/>
    <path d="M0 -6 Q2 -2 6 0 Q2 2 0 6 Q-2 2 -6 0 Q-2 -2 0 -6 Z" fill="#a78bfa" transform="translate(340, 130)"/>
  </g>

  <!-- Logo (scaled from site header SVG) centered -->
  <g transform="translate(540, 140) scale(5)">
    <!-- Three lines -->
    <rect x="4" y="6" width="8" height="2" rx="1" fill="#4C78FF"/>
    <rect x="4" y="10" width="12" height="2" rx="1" fill="#00D4FF"/>
    <rect x="4" y="14" width="6" height="2" rx="1" fill="#00F5FF"/>
    <!-- Three dots -->
    <circle cx="3" cy="7" r="1.5" fill="#825AFF"/>
    <circle cx="3" cy="11" r="1.5" fill="#00D4FF"/>
    <circle cx="3" cy="15" r="1.5" fill="#00F5FF"/>
    <!-- Sparkle small -->
    <g transform="translate(13,7) scale(0.7)">
      <path d="M0 -3 Q1 -1 3 0 Q1 1 0 3 Q-1 1 -3 0 Q-1 -1 0 -3 Z" fill="#00F5FF"/>
      <path d="M0 -2 Q0.7 -0.7 2 0 Q0.7 0.7 0 2 Q-0.7 0.7 -2 0 Q-0.7 -0.7 0 -2 Z" fill="#ffffff" opacity="0.8"/>
      <path d="M0 -1.2 Q0.4 -0.4 1.2 0 Q0.4 0.4 0 1.2 Q-0.4 0.4 -1.2 0 Q-0.4 -0.4 0 -1.2 Z" fill="#4C78FF"/>
    </g>
    <!-- Sparkle large -->
    <g transform="translate(17,11) scale(1.3)">
      <path d="M0 -3 Q1 -1 3 0 Q1 1 0 3 Q-1 1 -3 0 Q-1 -1 0 -3 Z" fill="#00F5FF"/>
      <path d="M0 -2 Q0.7 -0.7 2 0 Q0.7 0.7 0 2 Q-0.7 0.7 -2 0 Q-0.7 -0.7 0 -2 Z" fill="#ffffff" opacity="0.8"/>
      <path d="M0 -1.2 Q0.4 -0.4 1.2 0 Q0.4 0.4 0 1.2 Q-0.4 0.4 -1.2 0 Q-0.4 -0.4 0 -1.2 Z" fill="#825AFF"/>
    </g>
  </g>

  <!-- "SmartPMO.ai" small text above title -->
  <text x="600" y="295" text-anchor="middle"
        font-family="${FONT}" font-size="24" font-weight="600"
        fill="#8899bb" letter-spacing="3">SmartPMO.ai</text>

  <!-- Main title with gradient -->
  <text x="600" y="370" text-anchor="middle"
        font-family="${FONT}" font-size="72" font-weight="700"
        fill="url(#titleGrad)" letter-spacing="-1">SmartPMO Prompts</text>

  <!-- Divider line -->
  <rect x="300" y="395" width="600" height="2" rx="1" fill="url(#accentLine)"/>

  <!-- Subtitle -->
  <text x="600" y="445" text-anchor="middle"
        font-family="${FONT}" font-size="28" font-weight="400"
        fill="#b0c4de">AI Prompts for PMO Professionals</text>

  <!-- Bottom tagline -->
  <text x="600" y="520" text-anchor="middle"
        font-family="${FONT}" font-size="36" font-weight="400"
        fill="#9ca3af">Free · Expert-crafted · Anti-hallucination techniques built in</text>
</svg>`;

async function generate() {
  const outPath = path.join(__dirname, 'og-smartpmo-prompts.png');

  await sharp(Buffer.from(svg))
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(outPath);

  const info = await sharp(outPath).metadata();
  console.log(`Generated: ${outPath}`);
  console.log(`Size: ${info.width}x${info.height}, ${(require('fs').statSync(outPath).size / 1024).toFixed(1)} KB`);
}

generate().catch(err => { console.error(err); process.exit(1); });
