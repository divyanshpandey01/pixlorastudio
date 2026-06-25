const fs = require('fs');
const path = require('path');

// 1. Minification Functions
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ')             // collapse multiple whitespaces
    .replace(/\s*([{\}:;,])\s*/g, '$1') // remove spaces around brackets and punctuation
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')  // remove block comments
    .replace(/(?<!:)\/\/.*$/gm, '')    // remove line comments (protecting URLs)
    .replace(/\s+/g, ' ')              // collapse spaces
    .replace(/\s*([\{\}\(\)=\*\/,;:<>])\s*/g, '$1') // remove spaces around punctuation (preserving minus and plus)
    .trim();
}

// 2. Load Source Files
const cssSrc = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const jsSrc = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// 3. Minify
const cssMin = minifyCSS(cssSrc);
const jsMin = minifyJS(jsSrc);

// Write minified assets (optional, but good for reference)
fs.writeFileSync(path.join(__dirname, 'styles.min.css'), cssMin, 'utf8');
fs.writeFileSync(path.join(__dirname, 'script.min.js'), jsMin, 'utf8');

// 4. Reconstruct clean HTML template
// We will read the current index.html, extract content outside of <style>...</style> and <script>...</script> and replace them.
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Replace style block
html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>${cssMin}</style>`);

// Replace script block
html = html.replace(/<script(?: type="module")?>[\s\S]*?<\/script>/, `<script type="module">${jsMin}</script>`);

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Build completed successfully!');
console.log(`CSS minified: ${(cssSrc.length/1024).toFixed(2)} KB -> ${(cssMin.length/1024).toFixed(2)} KB`);
console.log(`JS minified: ${(jsSrc.length/1024).toFixed(2)} KB -> ${(jsMin.length/1024).toFixed(2)} KB`);
