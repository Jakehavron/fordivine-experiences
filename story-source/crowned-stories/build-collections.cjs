// Copy the reviewed collection HTML and scoped assets without regenerating story media.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../fordivine-upload-to-github/crowned-stories');
fs.mkdirSync(path.join(root, 'media'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(root, 'index.html'));
for (const name of fs.readdirSync(path.join(__dirname, 'collections'))) {
  fs.copyFileSync(path.join(__dirname, 'collections', name), path.join(root, path.basename(name, '.html'), 'index.html'));
}
for (const name of ['collections-v1.css', 'collection-tracking-v1.js', 'collections-motion-v1.js']) {
  fs.copyFileSync(path.join(__dirname, name), path.join(root, 'media', name));
}
console.log('Built Crowned Stories hub, three collections, and scoped assets.');
