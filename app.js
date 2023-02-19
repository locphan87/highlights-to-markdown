const fs = require("fs");
const axios = require("axios");

const DOMAINS = {
  oreilly: "https://learning.oreilly.com",
  OL: "https://openlibrary.org",
};

const app = async () => {
  const kindleParse = require("./kindleParser");
  const oreillyParse = require("./oreillyParser");
  const markdownBuilder = require("./markdownBuilder");

  var mode = process.argv[2];
  var sourcePath = process.argv[3];
  var outputPath = process.argv[4];

  if (!outputPath) outputPath = "output";

  if (mode === "kindle") {
    if (!sourcePath) sourcePath = "My Clippings.txt";
    var sourceFile = fs.readFileSync(sourcePath, "utf8");
    var books = await kindleParse(sourceFile);
  }

  if (mode === "oreilly") {
    if (!sourcePath) sourcePath = "oreilly-annotations.csv";
    var books = await oreillyParse(sourcePath);
  }

  const bookPromises = books.map(async (book, idx) => {
    const meta = await getBookMeta(book.id, book.title, book.author, `${idx + 1}/${books.length}`);
    return {
      ...book,
      ...meta,
    };
  });
  const newBooks = await Promise.all(bookPromises);

  markdownBuilder(newBooks, outputPath);
};

async function getBookMeta(id, title, author, order) {
  const SEARCH_API_URL = `${DOMAINS.oreilly}/api/v2/search/?formats=book`;
  const getURL = () => {
    if (!id)
      return [
        `${SEARCH_API_URL}`,
        `&query=title:${encodeURIComponent(title)} `,
        `author:${encodeURIComponent(author)}`,
      ].join("");
    return `${SEARCH_API_URL}&query=archive_id:${id}`;
  };
  const oreillyURL = getURL();
  try {
    const response = await axios.get(oreillyURL);
    const {
      results: [book],
    } = response.data;
    const {
      isbn,
      issued,
      publishers,
      archive_id,
      description,
      cover_url,
      authors,
      minutes_required,
      topics_payload,
    } = book;
    const hours = Math.floor(minutes_required / 60);
    const minutes = Math.floor(minutes_required - hours * 60);
    const published = new Date(issued);
    const mapAuthor = (author) => {
      const url = [
        `${DOMAINS.oreilly}/search/?query=author%3A%22`,
        `${encodeURIComponent(author)}%22&sort=relevance&highlight=true`,
      ].join("");
      return `<a href="${url}">${author}</a>`;
    };
    const mapTopic = (topic) => {
      const { name } = topic;
      return name;
    };
    console.log(`Book #${order} ${title} - Get book meta from O'reilly`);
    return {
      description,
      isbn,
      id: archive_id,
      issued: `${published.toLocaleString("default", {
        month: "long",
      })} ${published.getFullYear()}`,
      topics: topics_payload.map(mapTopic).join(", "),
      publishers: publishers.join(", "),
      author: authors.map(mapAuthor).join(", "),
      // coverUrl: cover_url,
      coverUrl: `${DOMAINS.oreilly}/covers/urn:orm:book:${archive_id}/400w/`,
      url: cover_url.replace("/cover/", "/view/-/"),
      duration: `${hours}h ${minutes}m`,
    };
  } catch (error) {
    console.log("ERROR getBookMeta => ", error.message, title);
    return await getCoverUrl(title, author, order);
  }
}

async function getCoverUrl(title, author, order) {
  let getISBNurl = `${DOMAINS.OL}/search.json?title=${encodeURIComponent(
    title
  )}`;
  if (author) getISBNurl += `&author=${encodeURIComponent(author)}`;
  try {
    const result = await axios.get(getISBNurl);
    const { docs } = result.data;
    if (docs.length === 0) return;
    const {
      isbn,
      author_name,
      author_key,
      publish_year,
      publisher,
      number_of_pages_median,
      subject_facet,
    } = docs[0];
    const mapAuthor = (author, index) => {
      return `<a href="${DOMAINS.OL}/authors/${
        author_key[index]
      }/${author.replace(" ", "_")}">${author}</a>`;
    };
    console.log(`Book #${order} ${title} - Get book meta from OL`);
    return {
      isbn: isbn[0],
      issued: publish_year[0],
      author: author_name.map(mapAuthor).join(", "),
      publishers: publisher.join(", "),
      topics: subject_facet && subject_facet.join(", "),
      pages: number_of_pages_median,
      coverUrl: `${DOMAINS.OL.replace("//", "//covers.")}/b/isbn/${
        isbn[0]
      }-L.jpg`,
    };
  } catch (error) {
    console.log("ERROR getCoverUrl => ", error.message, title);
  }
}

app();
