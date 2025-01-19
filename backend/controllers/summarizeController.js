// backend/controllers/summarizeController.js
const { extractPdfText } = require("../services/pdfExtractService");
const { extractImageText } = require("../services/imageExtractService");
const { summarizeText } = require("../services/summarizeService");
const { extractKeyPoints } = require("../services/keyPointService");

const summarizeController = async (files, summaryLength) => {
  let extractedText = "";

  // Extract text from PDF or image
  if (files.pdf) {
    extractedText = await extractPdfText(files.pdf[0].filepath);
  }

  if (files.image) {
    extractedText = await extractImageText(files.image[0].filepath);
  }

  if (!extractedText) {
    throw new Error("No text extracted from the uploaded file.");
  }

  // Summarize the extracted text
  const summaryText = await summarizeText(extractedText, summaryLength);

  // Extract key points from the summary
  const keyPoints = extractKeyPoints(summaryText);

  return {
    extractedText,
    summary: summaryText,
    keyPoints,
  };
};

module.exports = {summarizeController} ;
