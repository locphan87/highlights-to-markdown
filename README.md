# Kindle and O'Reilly highlights to Markdown

- [Introduction](#introduction)
  - [Major changes](#major-changes)
  - [Minor changes](#minor-changes)
- [Features](#features)
- [How to install?](#how-to-install)
  - [How to use for Kindle?](#how-to-use-for-kindle)
  - [How to use for O'Reilly Highlights?](#how-to-use-for-oreilly-highlights)

## Introduction

This repo is a fork of [highlights-to-markdown](https://gitlab.com/jpallares/highlights-to-markdown) on Gitlab. Thanks [Juan Pallarès](https://gitlab.com/jpallares)!

Here is the [CHANGELOG](./CHANGELOG.md) after forking.

## Features

Node app to parse your Kindle (My Clippings.txt) or O'Reilly highlights and create a Markdown file per book grouping the quotes.

The quotes are grouped by Chapter (O'reilly) or Page (Kindle). The books have the date of the most recent quote assigned.

The script will attempt to get metadata from [O'reilly Search API](https://www.oreilly.com/online-learning/integration-docs/search.html#/), fallback to [openlibrary.org](https://openlibrary.org/) if failure.

## How to install?

1. Install Node I you haven't
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
