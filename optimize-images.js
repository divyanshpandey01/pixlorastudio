const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'images');
const images = ['hero-bg.png', 'phone-mockup.png', 'qr-scene.png'];

async function optimize() {
  for (const img of images) {
    const inputPath = path.join(imgDir, img);
    const outputPath = path.join(imgDir, img.replace('.png', '.webp'));
    
    if (fs.existsSync(inputPath)) {
      console.log(`Optimizing ${img}...`);
      const originalSize = fs.statSync(inputPath).size;
      
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      const newSize = fs.statSync(outputPath).size;
      console.log(`Finished ${img}: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB (${((originalSize - newSize) / originalSize * 100).toFixed(1)}% reduction)`);
    } else {
      console.log(`File not found: ${inputPath}`);
    }
  }
}

optimize().catch(err => console.error(err));
