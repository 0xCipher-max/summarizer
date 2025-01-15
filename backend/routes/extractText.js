// backend/routes/extractText.js
const express = require("express");
const Tesseract = require("tesseract.js");
const formidable = require("formidable");
const fs = require("fs");
const router = express.Router();

// Define the image text extraction endpoint
router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error parsing the file." });
    }

    // Check if the image file is present
    if (!files.image || files.image.length === 0) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    // Get the path of the uploaded image
    const imagePath = files.image[0].filepath; // Access the filepath of the first file in the array

    // Use Tesseract.js to extract text from the image
    Tesseract.recognize(
      imagePath,
      "eng", // Language
      {
        logger: (m) => console.log(m), // Optional logger
      }
    )
      .then(({ data: { text } }) => {
        res.json({ extractedText: text });
      })
      .catch((error) => {
        console.error("Error extracting text from image:", error);
        res.status(500).json({ error: "Failed to extract text from image." });
      });
  });
});

module.exports = router;
