const indexes = require('../services/searchService');

function extractCDP(question) {
  const cdps = ['Segment', 'mParticle', 'Lytics', 'Zeotap'];
  return cdps.find(cdp => question.includes(cdp)) || null;
}

function extractKeywords(question) {
  const stopWords = ['how', 'do', 'i', 'in', 'can', 'a', 'to'];
  return question.split(' ')
    .filter(word => !stopWords.includes(word.toLowerCase()))
    .filter(word => !['Segment', 'mParticle', 'Lytics', 'Zeotap'].includes(word));
}

exports.askQuestion = (req, res) => {
  const { question } = req.body;
  const cdp = extractCDP(question);
  if (!cdp) {
    return res.json({ answer: "Please specify a CDP (Segment, mParticle, Lytics, or Zeotap)." });
  }
  const keywords = extractKeywords(question);
  const { index, docs } = indexes[cdp];
  const results = index.search(keywords.join(' '));
  if (results.length > 0) {
    const topResult = docs[results[0].ref];
    return res.json({ answer: topResult.content, source: `${cdp} - ${topResult.page}` });
  }
  return res.json({ answer: "I couldn't find information on that. Try rephrasing your question." });
};