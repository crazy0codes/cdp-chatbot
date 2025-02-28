const fs = require('fs');
const { scrapePage } = require('./src/utils/scraper');

async function scrapeAndSave(cdp, urls) {
  let allSections = [];
  for (let url of urls) {
    const sections = await scrapePage(url, cdp, url);
    allSections = allSections.concat(sections);
  }
  fs.writeFileSync(`./data/${cdp.toLowerCase()}.json`, JSON.stringify(allSections, null, 2));
}

// URLs for each CDP’s documentation
const segmentUrls = [
  'https://segment.com/docs/sources/',
  'https://segment.com/docs/connections/'
];
const mparticleUrls = [
  'https://docs.mparticle.com/guides/getting-started/',
  'https://docs.mparticle.com/guides/platform-guide/users/'
];
const lyticsUrls = [
  'https://docs.lytics.com/docs/getting-started',
  'https://docs.lytics.com/docs/audience-builder'
];
const zeotapUrls = [
  'https://docs.zeotap.com/home/en-us/getting-started',
  'https://docs.zeotap.com/home/en-us/data-integration'
];

// Run the scraper for each CDP
(async () => {
  await scrapeAndSave('Segment', segmentUrls);
  await scrapeAndSave('mParticle', mparticleUrls);
  await scrapeAndSave('Lytics', lyticsUrls);
  await scrapeAndSave('Zeotap', zeotapUrls);
  console.log('Scraping complete! JSON files are now populated.');
})();