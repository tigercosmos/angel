const cheerio = require('cheerio')
const puppeteer = require("puppeteer");

function getURL(content) {
  try {
    const $ = cheerio.load(content);

    const list = [];

    $("article").each((i, el) => {
      $(el).find('img').each((i, el2) => {
        const link = $(el2).attr("src");
        list.push(link);
      });
    });

    return list[Math.floor((Math.random() * list.length))];
  } catch (e) {
    console.log(e);
  }
}

async function getInstagramUrl() {
  const url_set = ["https://www.instagram.com/stargoodfriend", "https://instagram.com/ig_lovequotes520",
    "https://instagram.com/star_sign666", "https://instagram.com/deseostarofficial", "https://instagram.com/capricorntw88", "https://instagram.com/bts.bighitofical"
  ];
  const url = url_set[Math.floor((Math.random() * url_set.length))];
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.goto(url);
  page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight);
  });

  const content = await page.content();

  await browser.close();

  return getURL(content);
}

module.exports = getInstagramUrl;