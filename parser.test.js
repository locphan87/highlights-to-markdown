const fs = require('fs');
const parse = require('./parser');

describe('MyClippings to Mardown parser should', () => {
    test('split quotes', () => {
        const myClippings = fs.readFileSync('My Clippings.txt', 'utf8');
    
        expect(parse(myClippings).length).toBe(76);
      });

      test('map every quote', () => {
          const myClippings = fs.readFileSync('My Clippings.txt', 'utf8');

          const result = parse(myClippings);
      
          expect(result[5]).toStrictEqual({
            book: 'Scrum And Xp From The Trenches',
            author: 'Henrik Kniberg',
            date: '21/02/2015',
            quote: 'Pair programming does improve code quality. Pair programming does improve team focus (for example when the guy behind you says “hey is that stuff really necessary for this sprint?”). Surprisingly many developers that are strongly against pair programming actually haven’t tried it, and quickly learn to like it once they do try it. Pair programming is exhaustive and should not be done all day. Shifting pairs frequently is good. Pair programming does improve knowledge spread within the group. Surprisingly fast too. Some people just aren’t comfortable with pair programming. Don’t throw out an excellent programmer just because he isn’t comfortable with pair programming. Code review is an OK alternative to pair programming. The “navigator” (the guy not using the keyboard) should have a computer of his own as well. Not for development, but for doing little spikes when necessary, browsing documentation when the “driver” (the guy at the keyboard) gets stuck, etc. Don’t force pair programming upon people. Encourage people and provide the right tools but let them experiment with it at their own pace.'
          });
        });
});