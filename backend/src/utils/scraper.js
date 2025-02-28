const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const urls = {
  segment: "https://segment.com/docs/?ref=nav",
  mparticle: "https://docs.mparticle.com/",
  lytics: "https://docs.lytics.com/",
  zeotap: "https://docs.zeotap.com/home/en-us/",
};

async function scrapeDocs(url, cdp) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const content = [];
  $("h1, h2").each((i, elem) => {
    const section = $(elem).text();
    const text = $(elem).next("p").text();
    content.push({ cdp, page: "Home", section, content: text });
  });
  fs.writeFileSync(`data/${cdp}.json`, JSON.stringify(content));
}

Object.entries(urls).forEach(([cdp, url]) => scrapeDocs(url, cdp));