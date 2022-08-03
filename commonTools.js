function parseSymbols(input) {
  return input.replaceAll(':', '&#58;');
}

module.exports = parseSymbols;
