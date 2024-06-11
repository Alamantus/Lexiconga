const fs = require('node:fs');
const path = require('node:path');
const genericPage = require('../generic');

module.exports = () => {
  const pageContent = fs.readFileSync(path.resolve(__dirname, './content.md'), 'utf-8');
  return genericPage('Privacy Policy | Lexiconga', 'Details about how Lexiconga uses your data.', pageContent);
};
