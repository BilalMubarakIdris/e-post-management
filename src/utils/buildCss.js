const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildCss = () => {
  return new Promise((resolve) => {
    const cssPath = path.join(__dirname, '../public/css/style.css');
    const inputPath = path.join(__dirname, '../public/css/input.css');
    
    // Check if CSS exists and is recent
    if (fs.existsSync(cssPath)) {
      const cssStat = fs.statSync(cssPath);
      const inputStat = fs.existsSync(inputPath) ? fs.statSync(inputPath) : null;
      if (inputStat && cssStat.mtime >= inputStat.mtime) {
        console.log('CSS up to date');
        return resolve();
      }
    }
    
    console.log('Building CSS...');
    exec('npx tailwindcss -i ./src/public/css/input.css -o ./src/public/css/style.css --minify', 
      { cwd: path.join(__dirname, '../../') }, 
      (error, stdout, stderr) => {
        if (error) {
          console.error('CSS build error:', error.message);
        } else {
          console.log('CSS built successfully');
        }
        resolve();
      }
    );
  });
};

module.exports = { buildCss };
