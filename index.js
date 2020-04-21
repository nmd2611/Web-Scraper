const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const j2csv = require("json2csv").Parser;

const movies = [
  "https://www.imdb.com/title/tt2356180/?ref_=ttls_li_tt",
  "https://www.imdb.com/title/tt0871510/?ref_=ttls_li_tt",
  "https://www.imdb.com/title/tt0374887/?ref_=ttls_li_tt",
];

// this is an anonymous function which runs automatically
//(() => {})();

(async () => {
  let data = [];

  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text().trim();

    let rating = $('div [class = "ratingValue"] > strong > span').text();

    let summary = $('div [class = "summary_text" ] ').text().trim();

    data.push({
      title,
      rating,
      summary,
    });
  }

  const j2cp = new j2csv();
  const csv = j2cp.parse(data);

  fs.writeFileSync("./imdb.csv", csv, "utf-8");
  console.log("Data scraped successfully");
})();
