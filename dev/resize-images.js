const fs = require('fs');
const sharp = require('sharp');

const folder = './processedImages/';

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

const favicon = sharp('./src/images/favicon.svg');

favicon.clone().resize(32, 32).toFile(folder + 'favicon.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});

favicon.clone().resize(128, 128).toFile(folder + 'icon-128.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});

favicon.clone().resize(144, 144).toFile(folder + 'icon-144.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});

favicon.clone().resize(152, 152).toFile(folder + 'icon-152.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});

favicon.clone().resize(192, 192).toFile(folder + 'icon-192.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});

favicon.clone().resize(256, 256).toFile(folder + 'icon-256.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});

favicon.clone().resize(512, 512).toFile(folder + 'icon-512.png', (err, info) => {
  if (err) return console.error(err);
  console.log(info);
});