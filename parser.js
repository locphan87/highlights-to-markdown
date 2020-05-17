const moment = require('moment');

const SEPARATOR = '==========';
const INPUT_DATE_FORMAT = 'D [escaped] MMMM [escaped] YYYY H:mm:ss';
const OUTPUT_DATE_FORMAT = 'YYYY-MM-DD';

function parse(input) {
    const rawClippings = input.split(SEPARATOR).filter((clipping) => clipping != "");
    let books = [];

    rawClippings.map((clipping) => {
        const [ bookData, data, empty, quote ]= clipping.trim().split('\n');

        if (quote == null || quote.trim() == '')
            return;

        const datedQuote = {
            quote: quote,
            date: getDate(data),
        };

        const currentBookTitle = getBookTitle(bookData);

        var existingBook = getExistingBook(books, currentBookTitle);

        if (existingBook)
        {
            existingBook.quotes.push(datedQuote);
        }
        else
        {
            books.push({
                title: currentBookTitle,
                author: getAuthor(bookData),
                quotes: [datedQuote]
            });
        }
    });

    books.map((book) => {
        book.date = getOldestQuoteDate(book);
    })

    return books;
}

function getDate(data) {
    if (data) {
        const spanishDate = data.substring(data.lastIndexOf(",") + 2, data.lenght).trim();
        return moment(spanishDate, INPUT_DATE_FORMAT, 'es').format(OUTPUT_DATE_FORMAT);
    }

    return "";
}

function getBookTitle(bookData) {
    return bookData.substring(0, bookData.lastIndexOf("(")).trim();
}

function getExistingBook(books, currentBookTitle) {
    const filteredBooks = books.filter(b => b.title === currentBookTitle);
    if (filteredBooks.length > 0)
        return filteredBooks[0];

    return null;
}

function getAuthor(bookData) {
    return bookData.substring(bookData.lastIndexOf("(") + 1, bookData.lastIndexOf(")"));
}

function getOldestQuoteDate(book) {
    return book.quotes.reduce((r, o) => o.date > r.date ? o : r).date;
}

module.exports = parse;
