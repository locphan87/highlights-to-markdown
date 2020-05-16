const SEPARATOR = "==========";

function parse(input) {
    const rawQuotes = input.split(SEPARATOR).filter((clipping) => clipping != "");

    const processedQuotes = rawQuotes.map((clipping) => {
        const [ book, data, empty, quote ]= clipping.trim().split('\n');

        return {
            book: book.trim(),
            quote: quote
        }
    });

    return processedQuotes;

}

module.exports = parse;