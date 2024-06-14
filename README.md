# Kindle and O'Reilly highlights to Markdown

- [Introduction](#introduction)
- [Features](#features)
- [How to install?](#how-to-install)
  - [How to use for Kindle?](#how-to-use-for-kindle)
  - [How to use for O'Reilly Highlights?](#how-to-use-for-oreilly-highlights)
  - [How to use for O'Reilly Highlights JSON?](#how-to-use-for-oreilly-highlights-json)

## Introduction

This repo is a fork of [highlights-to-markdown](https://gitlab.com/jpallares/highlights-to-markdown) on Gitlab. Thanks [Juan Pallarès](https://gitlab.com/jpallares)!

Here is the [CHANGELOG](./CHANGELOG.md) after forking.

## Features

Node app to parse your Kindle (My Clippings.txt) or O'Reilly highlights and create a Markdown file per book grouping the quotes.

The quotes are grouped by Chapter (O'reilly) or Page (Kindle). The books have the date of the most recent quote assigned.

The script will attempt to get metadata from [O'reilly Search API](https://www.oreilly.com/online-learning/integration-docs/search.html#/), fallback to [openlibrary.org](https://openlibrary.org/) if failure.

Sample book generated from O'reilly: [The Manager Path](./exampleFiles/the-manager-s-path.md)

## How to install?

1. Install [Node](https://nodejs.org/en/download/) if you haven't
2. Clone and move to folder
3. `npm i`
4. Configure the output path `$MARKDOWN_PATH`

### How to use for Kindle?

1. Copy `My Clippings.txt` to this repo
1. `npm run kindle`
1. New files are generated at `$MARKDOWN_PATH/highlights/kindle/`

### How to use for O'Reilly Highlights?

1. Copy `oreilly-annotations.csv` to this repo
1. `npm run oreilly`
1. New files are generated at `$MARKDOWN_PATH/highlights/oreilly/`

### How to use for O'Reilly Highlights JSON?

Provide an additional visual enhancement by adding the additional formatting from the highlighted area to the Markdown. With the help of [Turndown](https://github.com/mixmark-io/turndown), the HTML from the highlighted section will be converted into Markdown. Additional Turndown rules can be implemented to handle specific formatting of O'Reilly.

1. Verify that there is no older copy of the JSON files in the `input` folder or files from a different book.
2. Copy the downloaded JSON files of a book into the `input` folder (Download instructions provided below).
3. Run the following command: `npm run oreillyjson`.
4. Retrieve the newly generated Markdown files from the output folder, for example: `$MARKDOWN_PATH/highlights/oreilly/`

#### Download O'Reilly Highlights as JSON files

1. Sign in to O’Reilly Learning and navigate to the Highlights section for the specific book.
2. Open the specific book.
3. Locate the book ID number (a 10-digit value) by from the URL in Address bar in you Browser `learning.o____.com/highlights/[BOOK ID]/`.
4. Instead of using the literal “Book ID,” open the link and extract the number obtained in the previous step. The link format is: `https://learning.o___.com/api/v1/annotations/[BOOK ID]/?page_size=100`.
5. Save the file as a JSON document, naming it something like `bookname_100.json`.
6. To retrieve additional highlights, follow the link provided after the “Next:” label and save the file with a different number (e.g., 200). Repeat this process until you reach the last batch of highlights until the next is “null”
