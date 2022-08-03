const parse = require('./oreillyParser');
const axios = require('axios');

jest.mock('axios');
const oreillyAnnotations = './exampleFiles/oreilly-annotations.csv';

describe('OReilly parser should', () => {
  axios.get.mockImplementation(() => Promise.resolve({ data: { docs: [] } }));

  test('group by books', async () => {
    const books = await parse(oreillyAnnotations);

    expect(books.length).toBe(4);
  });

  test('map every quote', async () => {
    const books = await parse(oreillyAnnotations);

    expect(books[0]).toStrictEqual({
      title: 'Monolith to Microservices',
      date: '2022-07-26',
      quotes: [
        {
          date: '2022-07-26',
          chapter: '1. Just Enough Microservices',
          quote:
            '"To guarantee independent deployability, we need to ensure our services are loosely coupled—in other words, we need to be able to change one service without having to change anything else. This means we need explicit, well-defined, and stable contracts between services"',
        },
        {
          date: '2022-07-25',
          chapter: '1. Just Enough Microservices',
          quote:
            '"This is an architecture in which we have high cohesion of related technology, but low cohesion of business functionality. If we want to make it easier to make changes, instead we need to change how we group code—we choose cohesion of business functionality, rather than technology"',
        },
      ],
    });
  });

  test('set oldest clipping date to book', async () => {
    const books = await parse(oreillyAnnotations);

    expect(books[1].date).toStrictEqual('2022-07-25');
  });

  test('parse colon in title to avoid errors in markdown', async () => {
    const books = await parse(oreillyAnnotations);

    expect(books[3].title).toStrictEqual(
      'Extreme Programming Explained&#58; Embrace Change, Second Edition'
    );
  });

  test('parse colon in quote to avoid errors in markdown', async () => {
    const books = await parse(oreillyAnnotations);

    expect(books[1].quotes[1].quote).toStrictEqual(
      '"These are the FICC properties&#58; fast, isolated, configuration-free, and consistent. If it’s hard to write such a test, or if it takes a long time to write it, the system isn’t testable."'
    );
  });

  test('parse multiline adding padding to all lines except first to avoid errors in markdown', async () => {
    const books = await parse(oreillyAnnotations);

    expect(books[1].quotes[8].quote).toEqual(
      `\"test that contains logic is usually testing more than one thing at a time, which isn’t recommended, because the test is less readable and more fragile. But test logic also adds complexity that may contain a hidden bug.
    A unit test should, as a general rule, be a series of method calls with assert calls, but no control flows, not even try-catch, and with assert calls. \"`
    );
  });
});
