
const fs = require('fs');
const markdownBuilder = require('./markdownBuilder');

const EXPECTED_PATH_1 = '2015-02-21-scrum-and-xp-from-the-trenches.md'
const EXPECTED_PATH_2 = '2000-01-01-another-book.md'

const books = [{
        title: 'Scrum And Xp From The Trenches',
        author: 'Henrik Kniberg',
        date: '2015-02-21',
        quotes: [
            {
                date: '2015-02-21',
                quote: 'Pair programming does improve code quality. Pair programming does improve team focus (for example when the guy behind you says “hey is that stuff really necessary for this sprint?”). Surprisingly many developers that are strongly against pair programming actually haven’t tried it, and quickly learn to like it once they do try it. Pair programming is exhaustive and should not be done all day. Shifting pairs frequently is good. Pair programming does improve knowledge spread within the group. Surprisingly fast too. Some people just aren’t comfortable with pair programming. Don’t throw out an excellent programmer just because he isn’t comfortable with pair programming. Code review is an OK alternative to pair programming. The “navigator” (the guy not using the keyboard) should have a computer of his own as well. Not for development, but for doing little spikes when necessary, browsing documentation when the “driver” (the guy at the keyboard) gets stuck, etc. Don’t force pair programming upon people. Encourage people and provide the right tools but let them experiment with it at their own pace.'
            },
            {
                date: '2015-02-19',
                quote: 'test'
            }
        ]
    },
    {
        title: 'another book',
        author: 'ahoter author',
        date: '2000-01-01',
        quotes: [{
          date: '2015-02-21',
          quote: 'dsdsd'
        }]
    }];

describe('markdownBuilder should', () => {
    afterAll(() => {
        fs.unlinkSync(EXPECTED_PATH_1)
        fs.unlinkSync(EXPECTED_PATH_2)
      });

  test('create a md file with correct name for each book', () => {

        markdownBuilder(books);

        expect(fs.existsSync(EXPECTED_PATH_1, 'utf8')).toBe(true);
        expect(fs.existsSync(EXPECTED_PATH_2, 'utf8')).toBe(true);
    });

    test('create md files with proper data', () => {
  
          markdownBuilder(books);
  
          expect(fs.readFileSync(EXPECTED_PATH_1, 'utf8')).toStrictEqual(
`---
title: Scrum And Xp From The Trenches
bookauthor: Henrik Kniberg
date: 2015-02-21
quotes:
  - date: 2015-02-21
    quote: Pair programming does improve code quality. Pair programming does improve team focus (for example when the guy behind you says “hey is that stuff really necessary for this sprint?”). Surprisingly many developers that are strongly against pair programming actually haven’t tried it, and quickly learn to like it once they do try it. Pair programming is exhaustive and should not be done all day. Shifting pairs frequently is good. Pair programming does improve knowledge spread within the group. Surprisingly fast too. Some people just aren’t comfortable with pair programming. Don’t throw out an excellent programmer just because he isn’t comfortable with pair programming. Code review is an OK alternative to pair programming. The “navigator” (the guy not using the keyboard) should have a computer of his own as well. Not for development, but for doing little spikes when necessary, browsing documentation when the “driver” (the guy at the keyboard) gets stuck, etc. Don’t force pair programming upon people. Encourage people and provide the right tools but let them experiment with it at their own pace.
  - date: 2015-02-19
    quote: test
---
## *{{page.bookauthor}}*

{% for quote in page.quotes %}
#### {{ quote.date | date: '%B %d, %Y' }}
{{ quote.quote }}
{% endfor %}
`);
      });
});