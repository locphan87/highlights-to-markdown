const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const templates = require('./templates');

function markdownBuilder(books, outputPath) {
    books.map((book) => {

        var fileContent = mustache.render(templates.bookTemplate, book);

        let fileName = `${book.title.replace('&#58;','').replace(/\W+/g, '-').toLowerCase()}.md`

        fs.writeFileSync(path.join(outputPath,fileName), fileContent);
    })
}

module.exports = markdownBuilder;