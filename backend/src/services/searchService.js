const lunr = require('lunr');
const fs = require('fs');

function createIndex(cdp) {
  const data = JSON.parse(fs.readFileSync(`./data/${cdp.toLowerCase()}.json`));
  const index = lunr(function () {
    this.ref('id');
    this.field('section');
    this.field('content');
    data.forEach((doc, id) => this.add({ id, section: doc.section, content: doc.content }));
  });
  return { index, docs: data };
}

const indexes = {
  Segment: createIndex('Segment'),
  mParticle: createIndex('mParticle'),
  Lytics: createIndex('Lytics'),
  Zeotap: createIndex('Zeotap')
};

module.exports = indexes;