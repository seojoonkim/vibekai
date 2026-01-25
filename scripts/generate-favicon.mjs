import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svgContent = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0b429" />
      <stop offset="100%" stop-color="#f7c948" />
    </linearGradient>
  </defs>
  <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="url(#logoGradient)" />
  <path d="M12 11L7 16L12 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M20 11L25 16L20 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M18 10L14 22" stroke="white" stroke-width="2" stroke-linecap="round" />
</svg>`;

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);

  // Generate different sizes
  const sizes = [16, 32, 48, 64, 128, 256];

  for (const size of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();

    writeFileSync(
      join(__dirname, '..', 'public', `favicon-${size}x${size}.png`),
      pngBuffer
    );
    console.log(`Generated favicon-${size}x${size}.png`);
  }

  // Generate main favicon.png (32x32)
  const favicon32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  writeFileSync(
    join(__dirname, '..', 'src', 'app', 'favicon.png'),
    favicon32
  );
  console.log('Generated src/app/favicon.png');

  // Generate apple-touch-icon (180x180) with background
  const appleSvg = `<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0b429" />
        <stop offset="100%" stop-color="#f7c948" />
      </linearGradient>
    </defs>
    <rect width="180" height="180" rx="40" fill="#0d1117" />
    <g transform="translate(42, 35) scale(3)">
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="url(#logoGradient)" />
      <path d="M12 11L7 16L12 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M20 11L25 16L20 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M18 10L14 22" stroke="white" stroke-width="2" stroke-linecap="round" />
    </g>
  </svg>`;

  const appleIcon = await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toBuffer();

  writeFileSync(
    join(__dirname, '..', 'src', 'app', 'apple-icon.png'),
    appleIcon
  );
  console.log('Generated src/app/apple-icon.png');

  console.log('All favicons generated successfully!');
}

generateFavicons().catch(console.error);
