// backend/routes/extractPdfText.js
const express = require("express");
const pdf = require("pdf-parse");
const formidable = require("formidable");
const fs = require("fs");
const router = express.Router();

// Define the PDF text extraction endpoint
router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  // Parse the incoming form data
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error parsing the file." });
    }

    // Log the files object to see what is being received
    console.log("Uploaded files:", files);

    // Check if the pdf file is present
    if (!files.pdf || files.pdf.length === 0) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    // Get the path of the uploaded PDF
    const pdfPath = files.pdf[0].filepath; // Access the filepath of the first file in the array

    // Read the PDF file
    let dataBuffer = fs.readFileSync(pdfPath);

    // Use pdf-parse to extract text from the PDF
    pdf(dataBuffer)
      .then((data) => {
        res.json({ extractedText: data.text });
      })
      .catch((error) => {
        console.error("Error extracting text from PDF:", error);
        res.status(500).json({ error: "Failed to extract text from PDF." });
      });
  });
});

module.exports = router;
