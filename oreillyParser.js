const csv = require('@fast-csv/parse')
const parseSymbols = require('./commonTools')
const { getQuoteByChapter } = require('./utils')

async function parse(input) {
  const data = await readCsv(input, {
    headers: true,
    ignoreEmpty: true,
  })

  return data
}

function readCsv(path, options) {
  return new Promise((resolve, reject) => {
    const data = []

    csv
      .parseFile(path, options)
      .on('error', reject)
      .on('data', (row) => {
        row.Highlight = `"${addPaddingToMultilineHighlight(row.Highlight)}"`
        data.push(row)
      })
      .on('end', () => {
        const books = parseCsv(data)
        resolve(books)
      })
  })
}

function addPaddingToMultilineHighlight(highlight) {
  let highlightLines = highlight.split('\n').filter((l) => l != '')
  const paddedLines = [
    highlightLines[0],
    ...highlightLines.slice(1).map((l) => '    ' + l),
  ]
  return paddedLines.join('\n')
}

function parseCsv(data) {
  let books = []
  const reverseData = [...data].reverse()

  for (const line of reverseData) {
    const book = books.find((b) => b.title == parseSymbols(line['Book Title']))
    const quote = createQuoteFromLine(line)
    if (book) {
      const prevQuote = getQuoteByChapter(book.quotes, quote.chapter)
      if (!!prevQuote) {
        prevQuote.quote = `${prevQuote.quote}\n\n${quote.quote}`
      } else {
        book.quotes.push(quote)
      }
    } else {
      const title = parseSymbols(line['Book Title'])
      const regex =
        /https:\/\/learning\.oreilly\.com\/library\/view\/-\/([0-9]+)\//i
      const bookURL = line['Book URL']
      const id = bookURL.match(regex)[1]
      books.push({
        id,
        title,
        date: line['Date of Highlight'],
        url: bookURL,
        quotes: [quote],
      })
    }
  }

  return books
}

function createQuoteFromLine(line) {
  const date = line['Date of Highlight']
  const url = line['Annotation URL']
  const quote = parseSymbols(line.Highlight)
  const note = parseSymbols(line['Personal Note'])
  const getQuote = () => {
    if (!!note) {
      return `${quote} | ==${note}==`
    }
    return quote
  }
  return {
    chapter: line['Chapter Title'],
    date,
    quote: `${getQuote()} | [${date}](${url})`,
  }
}

module.exports = parse
