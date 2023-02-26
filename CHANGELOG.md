# CHANGELOG

## Major changes

- Fix runtime errors.
- Update the [template](./templates.js). Optimized for [Obsidian](https://obsidian.md/)
- Get book metadata (not just cover URL) from O'reilly (instead of openlibrary). If it fails, use openlibrary.
  - Add more fields to the frontmatter: Duration, topics, publishers, publication date, number of pages, ISBN.
  - Get book description
  - Get the table of contents
- Group quotes by chapter/page.
- Reverse O'reilly highlights to the same order as Kindle clippings (top down)

## Minor changes

- Ignore Kindle clippings and O'reilly highlights files
- Format code with [prettier](https://prettier.io/)
