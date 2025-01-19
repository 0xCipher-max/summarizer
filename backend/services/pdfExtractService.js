// backend/services/pdfExtractService.js
const pdf = require("pdf-parse");
const fs = require("fs");

const extractPdfText = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } catch (error) {
    throw new Error("Failed to extract text from PDF.");
  }
};

module.exports = { extractPdfText };
