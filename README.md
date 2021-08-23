# MyClippings to Markdown

Node app to parses the kindle file that stores all the highlights you do in the books you read (My Clippings.txt) and creates a Markdown file per book grouping the quotes. It is intended to be used with Jekyll.
[Example of the output](https://juan.pallares.me/books/)

The quotes are ordered by date descending. The books have the date of the most recent quote assigned.

## How to use it

1. Install Node I you haven't
2. Clone and move to folder
3. `npm i`
4. `node app "some\path\My Clippings.txt" "output\path"`

It works also with only the first argument using `output` as default output folder.
It works also with no parameters but expects to find the `My Clippings.txt` in the project folder.

## Jekyll site usage

1. Create a \_books folder in your jekyll repo and move there all the generated md files.
1. Add the collection to your `_config.yml`:

```
include:
  - _books

...

collections:
  books:
    output: true
    permalink: /:collection/:path/

...

defaults:
  ...
  # _books
  - scope:
      path: ""
      type: books
    values:
      layout: single
      author_profile: true
      share: true
      comments: true

```

3. Add a navigation link in the top bar editing `navigation.yml`:

```
main:
- title: cv
  url: /cv/
- title: books
  url: /books/
```

4. Finally create a page that will have the links to all the books. I created `books.md`:

```
---
title: Books
layout: single
permalink: /books/
collection: books
---

some text

{% for book in site.books reversed %}
### [{{ book.title }}]({{ book.url }})
*{{ book.bookauthor }}*
{% endfor %}
```

## I want just the JSON

In case you want another type of output, there is a middle step (parse) were a simple array of objects (books) is created with the following structure:

```
[
    {
      title: 'Scrum And Xp From The Trenches',
      date: '2015-02-21',
      author: 'Henrik Kniberg',
      quotes: [
          {
            date: '2015-02-21',
            quote: 'Pair programming does improve code quality....'
        },
        {
            date: '2015-02-19',
            quote: 'anotherquote....'
        }
      ]
    },
    {
      title: 'Another book title',
      date: '2014-04-21',
      author: 'Fancy Name',
      quotes: [
          {
            date: '2017-02-21',
            quote: 'interensting quote....'
        },
        {
            date: '2019-02-19',
            quote: 'even more interesting quote....'
        }
      ]
    }
]
```
