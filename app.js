const fs = require('fs');
const axios = require('axios');

const app = async () => {
  const kindleParse = require('./kindleParser');
  const oreillyParse = require('./oreillyParser');
  const markdownBuilder = require('./markdownBuilder');

  var mode = process.argv[2];

  var sourcePath = process.argv[3];

  var outputPath = process.argv[4];
  if (!outputPath) outputPath = 'output';

  if (mode === 'kindle') {
    if (!sourcePath) sourcePath = 'My Clippings.txt';

    var sourceFile = fs.readFileSync(sourcePath, 'utf8');

    var books = await kindleParse(sourceFile);
  }
  if (mode === 'oreilly') {
    if (!sourcePath) sourcePath = 'oreilly-annotations.csv';

    var books = await oreillyParse(sourcePath);
    console.log('🚀 ~ file: app.js ~ line 27 ~ app ~ books', books[0].quotes);
  }

  for (const book of books) {
    const coverUrl = await getCoverUrl(book.title, book.author);
    if (coverUrl) {
      book.coverUrl = coverUrl;
    }
  }

  markdownBuilder(books, outputPath);
};

async function getCoverUrl(title, author) {
  let getISBNurl = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    title
  )}`;
  if (author) getISBNurl += `&author=${encodeURIComponent(author)}`;
  let coverUrl;
  try {
    const result = await axios.get(getISBNurl);
    if (result.data.docs.length > 0) {
      const ISBN = result.data.docs[0].isbn[0];
      coverUrl = `https://covers.openlibrary.org/b/isbn/${ISBN}-L.jpg`;
    }
  } catch (error) {
    console.log('ERROR => ', error.message);
  }

  return coverUrl;
}

app();
