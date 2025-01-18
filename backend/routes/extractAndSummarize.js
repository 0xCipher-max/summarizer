const express = require("express");
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const formidable = require("formidable");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// Function to summarize text using Hugging Face API
const summarizeText = async (text, summaryLength) => {
  const maxLengthMap = {
    short: 300, // Short summary length
    medium: 500, // Medium summary length
    long: 1024, // Long summary length
  };

  const maxLength = maxLengthMap[summaryLength]; // Get the maxLength based on the selected summary length
  console.log("Max Length for Summarization:", maxLength); // Log the maxLength being used

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text, parameters: { max_length: maxLength } },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );
    console.log("API Response:", response.data); // Log the API response

    // Return both the summary and the used maxLength
    return {
      summaryText: response.data[0].summary_text,
      usedMinLength: maxLength, // Include the used min_length or max_length
    };
  } catch (error) {
    console.error(
      "Error summarizing text:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to summarize text.");
  }
};


// Function to extract key points from the summary text
const extractKeyPoints = (text) => {
  // Basic idea: Split text into sentences and score them based on word frequency
  const sentences = text.split('.'); // Split the text into sentences
  const wordFrequency = {}; // Store word frequency

  // Count word frequency in the summary
  text.split(' ').forEach((word) => {
    word = word.toLowerCase().replace(/[^\w\s]/g, ''); // Clean the word
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Score sentences based on word frequency
  const sentenceScores = sentences.map((sentence) => {
    const words = sentence.split(' ');
    let score = 0;
    words.forEach((word) => {
      word = word.toLowerCase().replace(/[^\w\s]/g, '');
      score += wordFrequency[word] || 0; // Sum up the frequency of words in the sentence
    });
    return { sentence, score };
  });

  // Sort sentences by score in descending order
  sentenceScores.sort((a, b) => b.score - a.score);

  // Get top 3 key points (you can adjust the number as needed)
  const keyPoints = sentenceScores.slice(0, 3).map((item) => item.sentence.trim());

  return keyPoints;
};


router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing file:", err);
      return res.status(400).json({ error: "Error parsing the file." });
    }

    console.log("Summary Length from frontend:", fields.summaryLength); // Log summary length

    let extractedText = "";

    // Handle PDF file
    if (files.pdf) {
      try {
        const pdfPath = files.pdf[0].filepath;
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdf(dataBuffer);
        extractedText = pdfData.text;
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Failed to extract text from PDF." });
      }
    }

    // Handle image file
    if (files.image) {
      try {
        const imagePath = files.image[0].filepath;
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

    if (!extractedText) {
      return res
        .status(400)
        .json({ error: "No text extracted from the uploaded file." });
    }

    const summaryLength = fields.summaryLength || "medium"; // Default to medium if not provided
    console.log("Final Summary Length:", summaryLength);

    try {
      const { summaryText, usedMinLength } = await summarizeText(
        extractedText,
        summaryLength
      );
      const keyPoints = extractKeyPoints(summaryText);

      // Return both extracted text and summary with the used minLength
      res.json({
        extractedText,
        summary: summaryText,
        usedMinLength, // Include the used min_length or max_length in the response
        keyPoints
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
});


module.exports = router;
