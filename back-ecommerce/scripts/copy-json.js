'use strict';
const fs = require('fs');
const path = require('path');

function copyJsonFiles(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyJsonFiles(src, dest);
    else if (entry.name.endsWith('.json')) fs.copyFileSync(src, dest);
  }
}

copyJsonFiles('src', 'dist/src');
console.log('JSON schemas copied to dist/src');
