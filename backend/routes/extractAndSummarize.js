// backend/routes/extractAndSummarize.js
const express = require("express");
const formidable = require("formidable");
const { summarizeController } = require("../controllers/summarizeController");
const router = express.Router();

// Route that handles the file upload and summarization
router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing file:", err);
      return res.status(400).json({ error: "Error parsing the file." });
    }

    const summaryLength = fields.summaryLength || "medium";

    try {
      const { extractedText, summary, keyPoints } = await summarizeController(
        files,
        summaryLength
      );
      res.json({
        extractedText,
        summary,
        keyPoints,
      });
    } catch (error) {
      console.error("Error processing the file:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

module.exports = router;
