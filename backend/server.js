const express = require('express');
const cors = require('cors');

const extractAndSummarizeRoute = require('./routes/extractAndSummarize'); // Import the new route


const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use('/api/extract-and-summarize', extractAndSummarizeRoute); // Use the new route




app.listen(PORT, ()=>{
    console.log("Server Started at port 5000")
})
