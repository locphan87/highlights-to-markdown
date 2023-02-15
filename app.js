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
    console.log('🚀 Books', books.length);
  }

  const bookPromises = books.map(async book => {
    const coverUrl = await getCoverUrl(book.title, book.author);
    if (coverUrl) {
      return { ...book, coverUrl }
    } else {
      const meta = await getBookMeta(book.title, book.id)
      return {
        ...book,
        ...meta
      }
    }
  })
  const newBooks = await Promise.all(bookPromises)

  markdownBuilder(newBooks, outputPath);
};

async function getBookMeta(title, id) {
  const oreillyURL = `https://learning.oreilly.com/api/v2/search/?formats=book&query=archive_id:${id}`
  try {
    const response = await axios.get(oreillyURL)
    const { results: [book] } = response.data
    const { isbn, issued, virtual_pages, publishers, description, cover_url, authors, minutes_required } = book
    const hours = Math.floor(minutes_required / 60)
    const minutes = Math.floor(minutes_required - hours * 60)
    const published = new Date(issued)
    const mapAuthor = author => {
      const url = [
        `https://learning.oreilly.com/search/?query=author%3A%22`,
        `${encodeURIComponent(author)}%22&sort=relevance&highlight=true`
      ].join('')
      return `<a href="${url}">${author}</a>`
    }
    return {
      description,
      isbn,
      pages: Math.floor(virtual_pages / 1.5),
      issued: `${published.toLocaleString('default', { month: 'long' })} ${published.getFullYear()}`,
      publishers: publishers.join(', '),
      authors: authors.map(mapAuthor).join(', '),
      coverUrl: cover_url,
      duration: `${hours}h${minutes}m`
    }
  } catch(error) {
    console.log('ERROR getBookMeta => ', error.message, title, id);
    return {}
  }
}

async function getCoverUrl(title, author) {
  let getISBNurl = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    title
  )}`;
  if (author) getISBNurl += `&author=${encodeURIComponent(author)}`;
  let coverUrl;
  try {
    const result = await axios.get(getISBNurl);
    const { docs } = result.data
    if (docs.length === 0) return
    const { isbn } = docs[0]
    if (!isbn || isbn.length === 0) return
    coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn[0]}-L.jpg`;
  } catch (error) {
    console.log('ERROR getCoverUrl => ', error.message);
  }

  return coverUrl;
}

app();
