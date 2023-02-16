const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const templatesOreilly = require('./templates_oreilly');
const templatesKindle = require('./templates_kindle');

function markdownBuilder(books, outputPath = '', mode = 'kindle') {
  const templates = mode === 'kindle-new' ? templatesKindle : templatesOreilly;
  books.map((book, index) => {
    console.log(`${index + 1}. ${book.title}`);
    var fileContent = mustache.render(templates.bookTemplate, book);

    let fileName = `${book.title
      .replace('&#58;', '')
      .replace(/\W+/g, '-')
      .toLowerCase()}.md`;

    try {
      var filePath = path.join(outputPath, fileName);
      ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, fileContent);
    } catch (error) {
      console.log('ERROR WRITING = ', error.message);
    }
  });
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

module.exports = markdownBuilder;
