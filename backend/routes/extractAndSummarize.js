const express = require("express");
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Function to summarize text using Hugging Face API
const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );
    return response.data[0].summary_text;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Failed to summarize text.");
  }
};

// Extract text from a PDF file
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
};

// Extract text from an image file
const extractTextFromImage = async (filePath) => {
  const {
    data: { text },
  } = await Tesseract.recognize(filePath, "eng");
  return text;
};

// Define the extract and summarize endpoint
router.post("/", async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error parsing the file." });
    }

    let extractedText = "";

    try {
      if (files.pdf) {
        extractedText = await extractTextFromPDF(files.pdf[0].filepath);
        fs.unlinkSync(files.pdf[0].filepath); // Cleanup
      } else if (files.image) {
        extractedText = await extractTextFromImage(files.image[0].filepath);
        fs.unlinkSync(files.image[0].filepath); // Cleanup
      } else {
        return res.status(400).json({ error: "No valid file uploaded." });
      }

      if (!extractedText.trim()) {
        return res
          .status(400)
          .json({ error: "No text could be extracted from the file." });
      }

      const summary = await summarizeText(extractedText);
      res.json({ extractedText, summary });
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An error occurred." });
    }
  });
});

module.exports = router;
