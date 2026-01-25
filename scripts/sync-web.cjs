const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const targetDir = path.join(__dirname, '../www');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const filesToCopy = [
    'index.html',
    'auth.js',
    'phoneData.js'
];

filesToCopy.forEach(file => {
    const source = path.join(sourceDir, file);
    const target = path.join(targetDir, file);
    
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
        console.log(`Copied ${file} to www/`);
    } else {
        console.warn(`Warning: ${file} not found`);
    }
});

const assetsSource = path.join(sourceDir, 'assets');
const assetsTarget = path.join(targetDir, 'assets');

if (fs.existsSync(assetsSource)) {
    if (!fs.existsSync(assetsTarget)) {
        fs.mkdirSync(assetsTarget, { recursive: true });
    }
    
    fs.readdirSync(assetsSource).forEach(file => {
        fs.copyFileSync(
            path.join(assetsSource, file),
            path.join(assetsTarget, file)
        );
    });
    console.log('Copied assets/ to www/assets/');
}

console.log('Web sync complete!');
