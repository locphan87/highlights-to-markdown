const fs = require('fs');
const parse = require('./parser');

describe('MyClippings to Mardown parser should', () => {
    test('split quotes', () => {
        const myClippings = fs.readFileSync('My Clippings.txt', 'utf8');
    
        expect(parse(myClippings).length).toBe(76);
      });
});