function parse(input) {
    return input.split("==========").filter(function (el) {
        return el != ""});
}

module.exports = parse;