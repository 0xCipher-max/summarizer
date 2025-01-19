// backend/services/keyPointService.js
const extractKeyPoints = (text) => {
  const sentences = text.split(".");
  const wordFrequency = {};

  text.split(" ").forEach((word) => {
    word = word.toLowerCase().replace(/[^\w\s]/g, "");
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const sentenceScores = sentences.map((sentence) => {
    const words = sentence.split(" ");
    let score = 0;
    words.forEach((word) => {
      word = word.toLowerCase().replace(/[^\w\s]/g, "");
      score += wordFrequency[word] || 0;
    });
    return { sentence, score };
  });

  sentenceScores.sort((a, b) => b.score - a.score);

  return sentenceScores.slice(0, 3).map((item) => item.sentence.trim());
};

module.exports = { extractKeyPoints };
