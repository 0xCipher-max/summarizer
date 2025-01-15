const express = require('express');
const cors = require('cors');
const summarizeRoute = require('./routes/summarize')
const extractTextRoute = require('./routes/extractText'); // Import the new route
const extractPdfTextRoute = require('./routes/extractPdfText'); // Import the new route
const extractAndSummarizeRoute = require('./routes/extractAndSummarize'); // Import the new route


const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use('/api/summarize', summarizeRoute);
app.use('/api/extract-text', extractTextRoute); // Use the new route
app.use('/api/extract-pdf-text', extractPdfTextRoute); // Use the new route
app.use('/api/extract-and-summarize', extractAndSummarizeRoute); // Use the new route




app.listen(PORT, ()=>{
    console.log("Server Started at port 5000")
})
