// backend/services/imageExtractService.js
const Tesseract = require("tesseract.js");

const extractImageText = async (imagePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng");
    return text;
  } catch (error) {
    throw new Error("Failed to extract text from image.");
  }
};

module.exports = { extractImageText };
