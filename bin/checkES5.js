// ensure output files are ES5

const fs = require('fs');
const acorn = require('acorn');

const files = ['./client/index.js', './server/index.js', './server/loadMeta.js'];

console.log('Ensuring files are ES5:', files);
files.forEach(file => {
    const contents = fs.readFileSync(file, 'utf-8');
    try {
        acorn.parse(contents, { ecmaVersion: 5 });
    } catch (e) {
        console.error(`Error: ${file} is not ES5:`, e);
        process.exit(1);
    }
})
