#!/usr/bin/env node

// PWA Icon Generator Script
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PWA icon sizes required
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Base SVG template
const createSVGIcon = (size) => {
  const radius = Math.floor(size * 0.125); // 12.5% of size
  const fontSize = Math.floor(size * 0.4); // 40% of size
  const textY = Math.floor(size * 0.625); // 62.5% of size

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#667eea"/>
  <rect x="${Math.floor(size * 0.125)}" y="${Math.floor(
    size * 0.125
  )}" width="${Math.floor(size * 0.75)}" height="${Math.floor(
    size * 0.75
  )}" rx="${Math.floor(radius * 0.75)}" fill="#764ba2"/>
  <text x="${Math.floor(
    size * 0.5
  )}" y="${textY}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">T</text>
</svg>`;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for each size
iconSizes.forEach((size) => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${filename}`);
});

// Create a simple PNG placeholder (base64 encoded minimal PNG)
const createMinimalPNG = (size) => {
  // This is a minimal 1x1 PNG with the right dimensions
  // In production, you'd use a proper image library like sharp or canvas
  const base64PNG =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  return Buffer.from(base64PNG, "base64");
};

// Generate PNG placeholders
iconSizes.forEach((size) => {
  const pngContent = createMinimalPNG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, pngContent);
  console.log(`Created ${filename} (placeholder)`);
});

console.log("\nPWA icons generated successfully!");
console.log(
  "Note: PNG files are placeholders. For production, convert SVG to PNG using:"
);
console.log("- Online tools like CloudConvert or Convertio");
console.log("- Command line tools like ImageMagick or Inkscape");
console.log("- Node.js libraries like sharp or canvas");
