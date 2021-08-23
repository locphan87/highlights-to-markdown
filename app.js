const fs = require('fs');

const app = (async () => {
    const parse = require('./parser');
const markdownBuilder = require('./markdownBuilder');

var fileName = 'My Clippings.txt';
var outputPath = 'output';

if (process.argv[2]) fileName = process.argv[2];

if (process.argv[3]) outputPath = process.argv[3];

var myClippingsFile = fs.readFileSync(fileName, 'utf8');

var books = await parse(myClippingsFile);
console.log('outputPath: ', outputPath);

markdownBuilder(books, outputPath);
});

app();
