const moment = require('moment')
const { getQuoteByChapter } = require('./utils')

const SEPARATOR = '=========='
const INPUT_DATE_FORMAT = 'D [escaped] MMMM [escaped] YYYY H:mm:ss'
const OUTPUT_DATE_FORMAT = 'YYYY-MM-DD'

const parseSymbols = require('./commonTools')

async function parse(input) {
  const rawClippings = input
    .split(SEPARATOR)
    .filter((clipping) => clipping != '' && clipping != '\r\n')
  let books = []

  rawClippings.map((clipping) => {
    const [bookData, data, empty, quote] = clipping.trim().split('\n')
    const regex =
      /^- Your Highlight on page ([0-9]+) \| Location ([0-9]+-[0-9]+) \| Added on \w+, (.+) (\d+:\d+:\d+ [A-Z]{2})\r$/i
    const dataMatch = data.match(regex)

    if (quote == null || quote.trim() == '') return

    const datedQuote = {
      date: dataMatch[3],
      chapter: `Page ${dataMatch[1]}`,
      quote: `${parseSymbols(quote)} | ${dataMatch[3]}`,
      // date: getDate(data),
    }

    const currentBookTitle = getBookTitle(bookData)
    let existingBook = getExistingBook(books, currentBookTitle)

    if (existingBook) {
      const prevQuote = getQuoteByChapter(
        existingBook.quotes,
        datedQuote.chapter
      )
      if (!!prevQuote) {
        prevQuote.quote = `${prevQuote.quote}\n\n${datedQuote.quote}`
      } else {
        existingBook.quotes.push(datedQuote)
      }
    } else {
      books.push({
        title: currentBookTitle,
        author: getAuthor(bookData),
        quotes: [datedQuote],
      })
    }
  })

  books.map((book) => {
    book.date = getOldestQuoteDate(book)
  })

  return books
}

function getDate(data) {
  if (data) {
    const spanishDate = data
      .substring(data.lastIndexOf(',') + 2, data.length)
      .trim()
    return moment(spanishDate, INPUT_DATE_FORMAT, 'es').format(
      OUTPUT_DATE_FORMAT
    )
  }

  return ''
}

function getBookTitle(bookData) {
  return parseSymbols(bookData.substring(0, bookData.lastIndexOf('(')).trim())
}

function getExistingBook(books, currentBookTitle) {
  const filteredBooks = books.filter((b) => b.title === currentBookTitle)
  if (filteredBooks.length > 0) return filteredBooks[0]

  return null
}

function getAuthor(bookData) {
  return bookData.substring(
    bookData.lastIndexOf('(') + 1,
    bookData.lastIndexOf(')')
  )
}

function getOldestQuoteDate(book) {
  return book.quotes.reduce((r, o) => (o.date > r.date ? o : r)).date
}

module.exports = parse
