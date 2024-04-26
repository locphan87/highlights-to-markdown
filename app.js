const fs = require('fs')
const axios = require('axios')

const DOMAINS = {
  oreilly: 'https://learning.oreilly.com',
  OL: 'https://openlibrary.org',
}

const app = async () => {
  const kindleParse = require('./kindleParser')
  const oreillyParse = require('./oreillyParser')
  const oreillyJsonParser = require('./oreillyJsonParser')
  const markdownBuilder = require('./markdownBuilder')

  var mode = process.argv[2]
  var sourcePath = process.argv[3]
  var outputPath = process.argv[4]

  if (!outputPath) outputPath = 'output'

  if (mode === 'kindle') {
    if (!sourcePath) sourcePath = 'My Clippings.txt'
    var sourceFile = fs.readFileSync(sourcePath, 'utf8')
    var books = await kindleParse(sourceFile)
  }

  if (mode === 'oreilly') {
    if (!sourcePath) sourcePath = 'oreilly-annotations.csv'
    var books = await oreillyParse(sourcePath)
  }

  if (mode === 'oreillyjson') {
    if (!sourcePath) sourcePath = './input'
    var books = await oreillyJsonParser(sourcePath)
  }

  const bookPromises = books.map(async (book, idx) => {
    const meta = await getBookMeta(
      book.id,
      book.title,
      book.author,
      `${idx + 1}/${books.length}`
    )
    return {
      ...book,
      ...meta,
    }
  })
  const newBooks = await Promise.all(bookPromises)

  markdownBuilder(newBooks, outputPath)
}

async function getBookMeta(id, booktitle, author, order) {
  const SEARCH_API_URL = `${DOMAINS.oreilly}/api/v2/search/?formats=book`
  const getURL = () => {
    if (!id)
      return [
        `${SEARCH_API_URL}`,
        `&query=title:${encodeURIComponent(booktitle)} `,
        `author:${encodeURIComponent(author)}`,
      ].join('')
    return `${SEARCH_API_URL}&query=archive_id:${id}`
  }
  const oreillyURL = getURL()
  try {
    const response = await axios.get(oreillyURL)
    const {
      results: [book],
    } = response.data
    const {
      isbn,
      issued,
      publishers,
      archive_id,
      title, //-> optional if no title was found in quote
      description,
      cover_url,
      authors,
      minutes_required,
      topics_payload,
    } = book
    const hours = Math.floor(minutes_required / 60)
    const minutes = Math.floor(minutes_required - hours * 60)
    const published = new Date(issued)
    const mapAuthor = (author) => {
      const url = [
        `${DOMAINS.oreilly}/search/?query=author%3A%22`,
        `${encodeURIComponent(author)}%22&sort=relevance&highlight=true`,
      ].join('')
      return `<a href="${url}">${author}</a>`
    }
    const mapTopic = (topic) => {
      const { name } = topic
      return name
    }
    const currtitle = booktitle || title
    console.log(`Book #${order} ${currtitle} - Get book meta from O'reilly`)
    if (booktitle !== title && typeof booktitle !== 'undefined') {
      console.log('ERROR: Title are not equal')
    }
    const toc = await getTOC(archive_id)
    return {
      title,
      description,
      isbn,
      id: archive_id,
      toc,
      issued: `${published.toLocaleString('default', {
        month: 'long',
      })} ${published.getFullYear()}`,
      topics: topics_payload.map(mapTopic).join(', '),
      publishers: publishers.join(', '),
      author: authors.map(mapAuthor).join(', '),
      // coverUrl: cover_url,
      coverUrl: `${DOMAINS.oreilly}/covers/urn:orm:book:${archive_id}/400w/`,
      url: cover_url.replace('/cover/', '/view/-/'),
      duration: `${hours}h ${minutes}m`,
    }
  } catch (error) {
    console.log('ERROR getBookMeta => ', error.message, booktitle)
    if (!id) {
      console.log('no id')
      return await getCoverUrl(booktitle, author, order)
    } else {
      //if use is not logged in the book sometime is not found by the search api
      console.log(id)
      return await getBookApiMeta(id, booktitle, author, order)
    }
  }
}

async function getBookApiMeta(id, booktitle, author, order) {
  const BOOK_API_URL = `${DOMAINS.oreilly}/api/v1/book/${id}/`
  const oreillyURL = BOOK_API_URL
  try {
    const response = await axios.get(oreillyURL)
    const {
      isbn,
      issued,
      publishers, //  id, name, slug
      identifier, //-> identifier
      title, //-> optional if no title was found in quote
      description,
      cover, // -> cover
      authors, //authors.name
      topics, // ->topics
      pagecount,
    } = response.data
    const published = new Date(issued)

    const mapPublishers = (publishers) => {
      const { name } = publishers
      return name
    }
    const mapAuthor = (author) => {
      const { name } = author
      const url = [
        `${DOMAINS.oreilly}/search/?query=author%3A%22`,
        `${encodeURIComponent(name)}%22&sort=relevance&highlight=true`,
      ].join('')
      return `<a href="${url}">${name}</a>`
    }
    const mapTopic = (topic) => {
      const { name } = topic
      return name
    }
    const currtitle = booktitle || title
    console.log(`Book #${order} ${currtitle} - Get book meta from O'reilly`)
    if (booktitle !== title && typeof booktitle !== 'undefined') {
      console.log('ERROR: Title are not equal')
    }
    const toc = await getTOC(identifier)
    return {
      title,
      description,
      isbn,
      id: identifier,
      toc,
      issued: `${published.toLocaleString('default', {
        month: 'long',
      })} ${published.getFullYear()}`,
      topics: topics.map(mapTopic).join(', '),
      publishers: publishers.map(mapPublishers).join(', '),
      author: authors.map(mapAuthor).join(', '),
      // coverUrl: cover,
      coverUrl: `${DOMAINS.oreilly}/covers/urn:orm:book:${identifier}/400w/`,
      url: cover.replace('/cover/', '/view/-/'),
      pages: pagecount,
    }
  } catch (error) {
    console.log('ERROR getBookApiMeta => ', error.message, booktitle)
  }
}

async function getCoverUrl(title, author, order) {
  let getISBNurl = `${DOMAINS.OL}/search.json?title=${encodeURIComponent(
    title
  )}`
  if (author) getISBNurl += `&author=${encodeURIComponent(author)}`
  try {
    const result = await axios.get(getISBNurl)
    const { docs } = result.data
    if (docs.length === 0) return
    const {
      isbn,
      author_name,
      author_key,
      publish_year,
      publisher,
      number_of_pages_median,
      subject_facet,
    } = docs[0]
    const mapAuthor = (author, index) => {
      return `<a href="${DOMAINS.OL}/authors/${
        author_key[index]
      }/${author.replace(' ', '_')}">${author}</a>`
    }
    console.log(`Book #${order} ${title} - Get book meta from OL`)
    return {
      isbn: isbn[0],
      issued: publish_year[0],
      author: author_name.map(mapAuthor).join(', '),
      publishers: publisher.join(', '),
      topics: subject_facet && subject_facet.join(', '),
      pages: number_of_pages_median,
      coverUrl: `${DOMAINS.OL.replace('//', '//covers.')}/b/isbn/${
        isbn[0]
      }-L.jpg`,
    }
  } catch (error) {
    console.log('ERROR getCoverUrl => ', error.message, title)
  }
}
const getTOC = async (id) => {
  const url = `${DOMAINS.oreilly}/api/v1/book/${id}/flat-toc/`
  try {
    const response = await axios.get(url)
    const results = response.data
    return results.reduce((acc, c) => {
      if (c.depth !== 1) return acc
      return acc.concat({
        filename: c.filename,
        label: c.label.trim(),
      })
    }, [])
  } catch (error) {
    console.error(`Error in getTOC: ${error.message}`)
  }
}

app()
