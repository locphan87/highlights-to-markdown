const fs = require('fs');
const parse = require('./parser');

describe('MyClippings parser should', () => {
  let myClippings;

  beforeEach(() => {
    myClippings = fs.readFileSync('My Clippings.txt', 'utf8');
  });

  test('split clippings removing empty ones', () => {
    const books = parse(myClippings);

    let totalClippings = 0;
    books.map((b) => (totalClippings += b.quotes.length));
    expect(totalClippings).toBe(72);
  });

  test('map every quote', () => {
    const result = parse(myClippings);

    expect(result[1]).toStrictEqual({
      title: 'Scrum And Xp From The Trenches',
      date: '2015-02-21',
      position: 17,
      author: 'Henrik Kniberg',
      quotes: [
        {
          date: '2015-02-21',
          quote:
            'Pair programming does improve code quality. Pair programming does improve team focus (for example when the guy behind you says “hey is that stuff really necessary for this sprint?”). Surprisingly many developers that are strongly against pair programming actually haven’t tried it, and quickly learn to like it once they do try it. Pair programming is exhaustive and should not be done all day. Shifting pairs frequently is good. Pair programming does improve knowledge spread within the group. Surprisingly fast too. Some people just aren’t comfortable with pair programming. Don’t throw out an excellent programmer just because he isn’t comfortable with pair programming. Code review is an OK alternative to pair programming. The “navigator” (the guy not using the keyboard) should have a computer of his own as well. Not for development, but for doing little spikes when necessary, browsing documentation when the “driver” (the guy at the keyboard) gets stuck, etc. Don’t force pair programming upon people. Encourage people and provide the right tools but let them experiment with it at their own pace.',
        },
      ],
    });
  });

  test('parse colon to avoid errors', () => {
    const result = parse(`hola:hola (pepe)
- Tu subrayado en la posición 773-774 | Añadido el miércoles, 27 de enero de 2016 20:04:07

test :    test
==========`);

    expect(result[0]).toStrictEqual({
      title: 'hola&#58;hola',
      date: '2016-01-27',
      position: 1,
      author: 'pepe',
      quotes: [
        {
          date: '2016-01-27',
          quote: 'test &#58;    test',
        },
      ],
    });
  });

  test('group by books', () => {
    const result = parse(myClippings);

    expect(result.length).toBe(18);
  });

  test('set oldest clipping date to book', () => {
    const result = parse(myClippings);

    expect(result[2].date).toStrictEqual('2016-02-10');
  });

  test('set position in reverse order', () => {
    const result = parse(myClippings);

    expect(result[0].position).toStrictEqual(result.length);
    expect(result[result.length - 1].position).toStrictEqual(1);
  });
});
