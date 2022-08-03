const fs = require('fs');

const markdownBuilder = require('./markdownBuilder');

const EXPECTED_PATH_1 = 'scrum-and-xp-from-the-trenches.md';
const EXPECTED_PATH_2 = 'another-book.md';

const books = [
  {
    title: 'another book',
    author: 'ahoter author',
    date: '2000-01-01',
    quotes: [
      {
        date: '2015-02-21',
        quote: 'dsdsd',
      },
    ],
  },
  {
    title: 'Scrum And Xp&#58; From The Trenches',
    author: 'Henrik Kniberg',
    date: '2015-02-21',
    quotes: [
      {
        date: '2015-02-21',
        chapter: 'example chapter',
        quote:
          'Pair programming does improve code quality&#58; Pair programming does improve team focus...',
      },
      {
        date: '2015-02-19',
        quote: 'test',
      },
    ],
  },
];

describe('markdownBuilder should', () => {
  afterAll(() => {
    fs.unlinkSync(EXPECTED_PATH_1);
    fs.unlinkSync(EXPECTED_PATH_2);
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
title: Scrum And Xp&#58; From The Trenches
bookauthor: Henrik Kniberg
date: 2015-02-21
header:
  teaser: 
quotes:
  - date: 2015-02-21
    chapter: example chapter
    quote: Pair programming does improve code quality&#58; Pair programming does improve team focus...
  - date: 2015-02-19
    chapter: 
    quote: test
---
## *{{page.bookauthor}}*

<img width="300" src="{{ page.header.teaser }}"/>

{% for quote in page.quotes reversed %}
#### {{ quote.date | date: '%B %d, %Y' }} {{ quote.chapter}}
{{ quote.quote }}
{% endfor %}
`
    );
  });
});
