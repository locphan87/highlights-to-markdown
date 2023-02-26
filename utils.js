const getQuoteByChapter = (quotes, chapter) => {
  const filteredQuotes = quotes.filter((q) => q.chapter === chapter)
  if (filteredQuotes.length > 0) return filteredQuotes[0]
  return null
}
const reverseQuotes = (books) => {
  return books.map((b) => ({
    ...b,
    quotes: b.quotes.reverse(),
  }))
}

module.exports = {
  getQuoteByChapter,
  reverseQuotes,
}
