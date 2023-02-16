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
  }

  const bookPromises = books.map(async book => {
    const meta = await getBookMeta(book.id, book.title, book.author)
    return {
      ...book,
      ...meta
    }
  })
  const newBooks = await Promise.all(bookPromises)
  console.log('🚀 Books', newBooks.length);

  markdownBuilder(newBooks, outputPath, mode);
};

async function getBookMeta(id, title, author) {
  const SEARCH_API_URL = `https://learning.oreilly.com/api/v2/search/?formats=book`
  const getURL = () => {
    if (!id) return [
      `${SEARCH_API_URL}`,
      `&query=title:${encodeURIComponent(title)} `,
      `author:${encodeURIComponent(author)}`
    ].join('')
    return `${SEARCH_API_URL}&query=archive_id:${id}`
  }
  const oreillyURL = getURL()
  try {
    const response = await axios.get(oreillyURL)
    const { results: [book] } = response.data
    const { isbn, issued, publishers, archive_id, description, cover_url, authors, minutes_required } = book
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
      id: archive_id,
      issued: `${published.toLocaleString('default', { month: 'long' })} ${published.getFullYear()}`,
      publishers: publishers.join(', '),
      author: authors.map(mapAuthor).join(', '),
      coverUrl: cover_url,
      url: cover_url.replace('/cover/', '/view/-/'),
      duration: `${hours}h ${minutes}m`
    }
  } catch(error) {
    console.log('ERROR getBookMeta => ', error.message, title, id);
    return await getCoverUrl(title, author)
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

  return { coverUrl };
}

app();
