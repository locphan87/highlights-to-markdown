const fs = require('fs')
const path = require('path')
const url = require('url')
const axios = require('axios')

const parseSymbols = require('./commonTools')
const { getQuoteByChapter } = require('./utils')

const TurndownService = require('turndown')

var turndownService = new TurndownService({ bulletListMarker: '-' })

const BASE_DOMAIN = 'https://learning.oreilly.com'

const ChaptersByBooks = new Map()

async function ChaptersfromBooks(BookId) {
  if (!ChaptersByBooks.has(BookId)) {
    try {
      // Fetch chapter data from the external web service
      const Chapters = await getTOC(BookId)
      console.log('API is only called once getTOC')

      // Store the chapter data in the map
      ChaptersByBooks.set(BookId, Chapters)
    } catch (error) {
      console.error(`Error fetching data for ID ${BookId}: ${error.message}`)
    }
  }

  // Update the record with additional information
  return ChaptersByBooks.get(BookId)
}

const getTOC = async (id) => {
  const url = `${BASE_DOMAIN}/api/v1/book/${id}/flat-toc/`
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

/**
 * Search directory for JSON annotations and sort files (reverse order)
 *
 */
function scanDirSortFiles(directoryPath) {
  // Read the filenames in the directory []
  const jsonFiles = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith('.json'))

  const annotationsFiles = jsonFiles.map((filename) => {
    const filePath = path.join(directoryPath, filename)
    const data = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(data)

    let pageCurrent

    // Check if "next" is null
    if (jsonData.next === null) {
      // Get the current Page number from previous URL (Last page)
      const alternativeURL = jsonData.previous
      const parsedURL = new URL(alternativeURL)
      const pageValue = parsedURL.searchParams.get('page')
      //Typecast to not concatenate String
      pageCurrent = Number(pageValue) + 1
      // console.log(typeof pageCurrent);
    } else {
      // Handle the case when "next" is not null
      // console.log('Next URL is available:', jsonData.next);
      const nextURL = jsonData.next
      const parsedURL = new URL(nextURL)

      const pageValue = parsedURL.searchParams.get('page')
      pageCurrent = pageValue - 1
    }

    return { id: pageCurrent, filename }
  })

  //sort reverse order to have oldest annotation first.
  annotationsFiles.sort((itemA, itemB) => itemB.id - itemA.id)

  return annotationsFiles
}

/* 
Orelly 
- identifier (uuid)
- quote -> fragment (HTML)
- text (personal note)
- last_modified_time
- /chapter_title
- chapter_url
- /epub_identifier
- /epub_title

*/

async function parseJsonFile(files, directoryPath) {
  let books = []

  for (const file of files) {
    const filePath = path.join(directoryPath, file.filename)
    var sourceFile = fs.readFileSync(filePath, 'utf8')
    const JsonData = JSON.parse(sourceFile)
    const data = JsonData.results

    const reverseData = [...data].reverse()

    for (const line of reverseData) {
      // const book = books.find((b) => b.title == parseSymbols(line.epub_title))
      const book = books.find((b) => b.id == IDFromBookURL(line.chapter_url))
      const quote = await createQuoteFromLine(line)
      if (book) {
        const prevQuote = getQuoteByChapter(book.quotes, quote.chapter)
        if (!!prevQuote) {
          prevQuote.quote = `${prevQuote.quote}\n\n${quote.quote}`
        } else {
          book.quotes.push(quote)
        }
      } else {
        let title //no book title aviable
        const id = IDFromBookURL(line.chapter_url)
        books.push({
          id,
          title,
          date: line.last_modified_time,
          url: line.chapter_url,
          quotes: [quote],
        })
      }
    }
  }
  return books
}

async function createQuoteFromLine(line) {
  const id = IDFromBookURL(line.chapter_url)

  const regex = /([^/]+\.xhtml)$/
  const bookURL = line.chapter_url
  const chapterFile = bookURL.match(regex)[1]

  const chapters = await ChaptersfromBooks(id)
  const chapter = chapters.find((c) => c.filename == chapterFile)
  const chapterTitle = chapter.label
  const date = line.last_modified_time
  const url = `${line.chapter_url}#${line.identifier}`
  // const quote = parseSymbols(line.quote)
  // get quote as HTML from "fragment" and convert it to Markdown
  const quote = turndownService.turndown(line.fragment)
  const note = parseSymbols(line.text)
  const getQuote = () => {
    if (!!note) {
      return `${quote} | ==${note}==`
    }
    return quote
  }
  return {
    chapter: chapterTitle,
    date,
    quote: `${getQuote()} | [${date}](${url})`,
  }
}

function IDFromBookURL(url) {
  //chapter URL
  const regex =
    /https:\/\/learning\.oreilly\.com\/library\/view\/-\/([0-9]+)\//i
  const bookURL = url
  const id = bookURL.match(regex)[1]

  return id
}

async function parseFiles(path) {
  const isDirectory = fs.lstatSync(path).isDirectory()
  console.log(`Is "${path}" a directory? ${isDirectory}`)

  const files = scanDirSortFiles(path)
  const books = parseJsonFile(files, path)

  return books
}

module.exports = parseFiles
