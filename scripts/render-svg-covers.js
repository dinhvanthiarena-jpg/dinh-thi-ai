const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, 'svg-src');
const outDir = path.join(__dirname, '..', 'public', 'images', 'blog');

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.svg'));

async function run() {
  for (const file of files) {
    const svgBuffer = fs.readFileSync(path.join(srcDir, file));
    const outName = file.replace(/\.svg$/, '-photo.jpg');
    const outPath = path.join(outDir, outName);
    await sharp(svgBuffer, { density: 150 })
      .resize(1280, 720)
      .jpeg({ quality: 82 })
      .toFile(outPath);
    console.log('rendered:', outName);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
