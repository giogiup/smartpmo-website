#!/usr/bin/env node
/**
 * Generate email-safe PNG logo for newsletter header.
 * Renders the SmartPMO.ai logo SVG at 400x80 (retina, displayed at 200x40).
 */
const sharp = require('sharp');
const path = require('path');

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80" viewBox="0 0 400 80">
  <!-- Background: transparent -->

  <!-- Logo icon (scaled from 24x24 viewBox to ~36x36, centered vertically) -->
  <g transform="translate(20, 10) scale(2.5)">
    <rect x="4" y="6" width="8" height="2" rx="1" fill="#4C78FF"/>
    <rect x="4" y="10" width="12" height="2" rx="1" fill="#00D4FF"/>
    <rect x="4" y="14" width="6" height="2" rx="1" fill="#00F5FF"/>
    <circle cx="3" cy="7" r="1.5" fill="#825AFF"/>
    <circle cx="3" cy="11" r="1.5" fill="#00D4FF"/>
    <circle cx="3" cy="15" r="1.5" fill="#00F5FF"/>
    <g transform="translate(13,7) scale(0.7)">
      <path d="M0 -3 Q1 -1 3 0 Q1 1 0 3 Q-1 1 -3 0 Q-1 -1 0 -3 Z" fill="#00F5FF"/>
      <path d="M0 -2 Q0.7 -0.7 2 0 Q0.7 0.7 0 2 Q-0.7 0.7 -2 0 Q-0.7 -0.7 0 -2 Z" fill="#ffffff" opacity="0.8"/>
      <path d="M0 -1.2 Q0.4 -0.4 1.2 0 Q0.4 0.4 0 1.2 Q-0.4 0.4 -1.2 0 Q-0.4 -0.4 0 -1.2 Z" fill="#4C78FF"/>
    </g>
    <g transform="translate(17,11) scale(1.3)">
      <path d="M0 -3 Q1 -1 3 0 Q1 1 0 3 Q-1 1 -3 0 Q-1 -1 0 -3 Z" fill="#00F5FF"/>
      <path d="M0 -2 Q0.7 -0.7 2 0 Q0.7 0.7 0 2 Q-0.7 0.7 -2 0 Q-0.7 -0.7 0 -2 Z" fill="#ffffff" opacity="0.8"/>
      <path d="M0 -1.2 Q0.4 -0.4 1.2 0 Q0.4 0.4 0 1.2 Q-0.4 0.4 -1.2 0 Q-0.4 -0.4 0 -1.2 Z" fill="#825AFF"/>
    </g>
    <g transform="translate(11,15) scale(1.0)">
      <path d="M0 -3 Q1 -1 3 0 Q1 1 0 3 Q-1 1 -3 0 Q-1 -1 0 -3 Z" fill="#ffffff"/>
      <path d="M0 -2 Q0.7 -0.7 2 0 Q0.7 0.7 0 2 Q-0.7 0.7 -2 0 Q-0.7 -0.7 0 -2 Z" fill="#00F5FF" opacity="0.9"/>
      <path d="M0 -1.2 Q0.4 -0.4 1.2 0 Q0.4 0.4 0 1.2 Q-0.4 0.4 -1.2 0 Q-0.4 -0.4 0 -1.2 Z" fill="#4C78FF"/>
    </g>
  </g>

  <!-- "SmartPMO.ai" text -->
  <text x="95" y="52" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#06B6D4" letter-spacing="-0.5">SmartPMO.ai</text>
</svg>`;

async function generate() {
  const outPath = path.join(__dirname, 'logo-email.png');
  await sharp(Buffer.from(SVG))
    .png()
    .toFile(outPath);
  console.log('Generated:', outPath);
}

generate().catch(console.error);
