const fs = require('fs');

function markdownBuilder(books) {
    books.map((book) => {
        let fileName = `${book.date}-${book.book.replace(/\W+/g, '-').toLowerCase()}.md`

        fs.writeFileSync(fileName, '');
    })
}

module.exports = markdownBuilder;