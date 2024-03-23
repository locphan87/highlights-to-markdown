const fs = require('fs')
const parse = require('./kindleParser')
const axios = require('axios')

jest.mock('axios')

describe('MyClippings parser should', () => {
  let myClippings

  axios.get.mockImplementation(() => Promise.resolve({ data: { docs: [] } }))

  beforeEach(() => {
    myClippings = fs.readFileSync('./exampleFiles/My Clippings.txt', 'utf8')
  })

  test('split clippings removing empty ones', async () => {
    const result = await parse(myClippings)
    let totalClippings = 0
    result.map((b) => (totalClippings += b.quotes.length))
    expect(totalClippings).toBe(28)
  })

  test('map every quote', async () => {
    const result = await parse(myClippings)

    expect(result[1]).toStrictEqual({
      title: 'Scrum And Xp From The Trenches',
      date: '2015-02-21',
      author: 'Henrik Kniberg',
      quotes: [
        {
          date: '2015-02-21',
          quote:
            'Pair programming does improve code quality. Pair programming does improve team focus (for example when the guy behind you says “hey is that stuff really necessary for this sprint?”). Surprisingly many developers that are strongly against pair programming actually haven’t tried it, and quickly learn to like it once they do try it. Pair programming is exhaustive and should not be done all day. Shifting pairs frequently is good. Pair programming does improve knowledge spread within the group. Surprisingly fast too. Some people just aren’t comfortable with pair programming. Don’t throw out an excellent programmer just because he isn’t comfortable with pair programming. Code review is an OK alternative to pair programming. The “navigator” (the guy not using the keyboard) should have a computer of his own as well. Not for development, but for doing little spikes when necessary, browsing documentation when the “driver” (the guy at the keyboard) gets stuck, etc. Don’t force pair programming upon people. Encourage people and provide the right tools but let them experiment with it at their own pace.',
        },
      ],
    })
  })

  test('group by books', async () => {
    const result = await parse(myClippings)
    expect(result.length).toBe(28)
  })

  test('set oldest clipping date to book', async () => {
    const result = await parse(myClippings)
    expect(result[2].date).toStrictEqual('2016-02-10')
  })
})
