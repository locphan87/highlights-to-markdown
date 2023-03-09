const getQuoteByChapter = (quotes, chapter) => {
  const filteredQuotes = quotes.filter((q) => q.chapter === chapter)
  if (filteredQuotes.length > 0) return filteredQuotes[0]
  return null
}

module.exports = {
  getQuoteByChapter,
}
