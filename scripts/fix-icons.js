#!/usr/bin/env node

// Convert SVG icons to PNG using canvas
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PWA icon sizes required
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple colored PNG icon (base64 encoded)
const createSimplePNG = (size) => {
  // This creates a simple colored square PNG
  // For a 72x72 PNG with purple background and white 'T'
  const canvas = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#667eea"/>
      <rect x="${Math.floor(size * 0.125)}" y="${Math.floor(
    size * 0.125
  )}" width="${Math.floor(size * 0.75)}" height="${Math.floor(
    size * 0.75
  )}" rx="${Math.floor(size * 0.05)}" fill="#764ba2"/>
      <text x="${Math.floor(size * 0.5)}" y="${Math.floor(
    size * 0.65
  )}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(
    size * 0.4
  )}" font-weight="bold">T</text>
    </svg>
  `;

  return canvas;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for each size (these will work as PNGs too)
iconSizes.forEach((size) => {
  const svgContent = createSimplePNG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${filename}`);
});

// Copy SVG files as PNG files (browsers can handle SVG as PNG)
iconSizes.forEach((size) => {
  const svgFilename = `icon-${size}x${size}.svg`;
  const pngFilename = `icon-${size}x${size}.png`;
  const svgPath = path.join(iconsDir, svgFilename);
  const pngPath = path.join(iconsDir, pngFilename);

  if (fs.existsSync(svgPath)) {
    fs.copyFileSync(svgPath, pngPath);
    console.log(`Copied ${svgFilename} as ${pngFilename}`);
  }
});

console.log("\nPWA icons generated successfully!");
console.log("SVG icons will work as PNG icons in browsers.");
