const express = require("express");
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();

// Function to summarize text using Hugging Face API
const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );
    return response.data[0].summary_text;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error("Invalid or expired token. Please check your API key.");
    }
    throw new Error("Failed to summarize text.");
  }
};


// Define the extract and summarize endpoint
router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error parsing the file." });
    }

    let extractedText = "";

    // Check if the uploaded file is a PDF
    if (files.pdf) {
      const pdfPath = files.pdf[0].filepath;
      try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdf(dataBuffer);
        extractedText = pdfData.text;
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to extract text from PDF." });
      }
    }

    // Check if the uploaded file is an image
    if (files.image) {
      const imagePath = files.image[0].filepath;
      try {
        const {
          data: { text },
        } = await Tesseract.recognize(imagePath, "eng");
        extractedText = text;
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to extract text from image." });
      }
    }

    // If no text was extracted, return an error
    if (!extractedText) {
      return res
        .status(400)
        .json({ error: "No text extracted from the uploaded file." });
    }

    // Summarize the extracted text
    try {
      const summary = await summarizeText(extractedText);
      res.json({ extractedText, summary });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
});

module.exports = router;