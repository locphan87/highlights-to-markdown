const moment = require('moment');

const SEPARATOR = '==========';
const DATE_FORMAT = 'D [escaped] MMMM [escaped] YYYY H:mm:ss';

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

        const currentBookName = getBookName(bookData);

        var existingBook = getExistingBook(books, currentBookName);

        if (existingBook)
        {
            existingBook.quotes.push(datedQuote);
        }
        else
        {
            books.push({
                book: currentBookName,
                author: getAuthor(bookData),
                quotes: [datedQuote]
            });
        }
    });

    return books;
}

function getExistingBook(books, currentBookName) {
    const filteredBooks = books.filter(b => b.book === currentBookName);
    if (filteredBooks.length > 0)
        return filteredBooks[0];

    return null;
}

function getDate(data) {
    if (data) {
        const spanishDate = data.substring(data.lastIndexOf(",") + 2, data.lenght).trim();
        return moment(spanishDate, DATE_FORMAT, 'es').calendar();
    }

    return "";
}

function getBookName(bookData) {
    return bookData.substring(0, bookData.lastIndexOf("(")).trim();
}

function getAuthor(bookData) {
    return bookData.substring(bookData.lastIndexOf("(") + 1, bookData.lastIndexOf(")"));
}

module.exports = parse;
