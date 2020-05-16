const moment = require('moment');

const SEPARATOR = '==========';
const DATE_FORMAT = 'D [escaped] MMMM [escaped] YYYY H:mm:ss';

function parse(input) {
    const rawClippings = input.split(SEPARATOR).filter((clipping) => clipping != "");
    let books = [];

    const processedClippings = rawClippings.map((clipping) => {
        const [ bookData, data, empty, quote ]= clipping.trim().split('\n');

        const currentBookName = getBookName(bookData);

        var existingBooks = books.filter(b => b.book === currentBookName);

        if (existingBooks.length > 0)
        {
            existingBooks[0].quotes.push({
                quote: quote,
                date: getDate(data),
            });
        }
        else
        {
            books.push({
                book: getBookName(bookData),
                author: getAuthor(bookData),
                quotes: [{
                    quote: quote,
                    date: getDate(data),
                }]
            });
        }
    });

    return books;
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
