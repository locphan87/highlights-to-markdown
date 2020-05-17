const fs = require('fs');
const mustache = require('mustache');

const templates = require('./templates');

function markdownBuilder(books) {
    books.map((book) => {

        var fileContent = mustache.render(templates.bookTemplate, book);

        let fileName = `${book.title.replace('&#58;','').replace(/\W+/g, '-').toLowerCase()}.md`

        fs.writeFileSync(fileName, fileContent);
    })
}

module.exports = markdownBuilder;