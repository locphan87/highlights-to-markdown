function parseSymbols(input) {
  if (!input || !input.replaceAll) return input
  return input.replaceAll(':', '&#58;');
}

module.exports = parseSymbols;
