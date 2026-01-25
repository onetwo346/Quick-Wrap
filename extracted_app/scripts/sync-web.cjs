const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'www');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyIfExists(relPath) {
  const src = path.join(root, relPath);
  if (!fs.existsSync(src)) return;
  copyFile(src, path.join(outDir, relPath));
}

function main() {
  ensureDir(outDir);

  copyIfExists('index.html');
  copyIfExists('auth.js');
  copyIfExists('phoneData.js');

  for (const file of fs.readdirSync(root)) {
    if (file.toLowerCase().endsWith('.png')) {
      copyIfExists(file);
    }
  }

  const nojekyll = path.join(outDir, '.nojekyll');
  fs.writeFileSync(nojekyll, '');

  process.stdout.write(`Synced web assets to ${outDir}\n`);
}

main();
