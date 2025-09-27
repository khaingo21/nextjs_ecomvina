const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure the products directory exists
const productsDir = path.join(__dirname, 'public', 'assets', 'images', 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Product image names from the InterestedProducts component
const productImages = [
  'iphone-13-pro-max.jpg',
  's22-ultra.jpg',
  'macbook-air-m2.jpg',
  'dell-xps-13.jpg',
  'airpods-pro-2.jpg',
  'sony-wh1000xm5.jpg',
  'galaxy-watch5-pro.jpg',
  'ipad-air-5.jpg'
];

// Function to create a placeholder image
function createPlaceholderImage(filename, width = 600, height = 600) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background color
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = '#999';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(filename.replace('.jpg', ''), width / 2, height / 2);
  
  // Border
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);
  
  // Save to file
  const out = fs.createWriteStream(path.join(productsDir, filename));
  const stream = canvas.createJPEGStream({ quality: 0.8 });
  stream.pipe(out);
}

// Create placeholder images
productImages.forEach(imageName => {
  createPlaceholderImage(imageName);
  console.log(`Created placeholder: ${imageName}`);
});

console.log('All placeholder images have been generated!');
