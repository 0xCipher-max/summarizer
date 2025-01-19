// backend/services/summarizeService.js
const axios = require("axios");

const summarizeText = async (text, summaryLength) => {
  const maxLengthMap = {
    short: 300,
    medium: 500,
    long: 1024,
  };

  const maxLength = maxLengthMap[summaryLength];

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
    console.log(response);
    return response.data[0].summary_text;
  } catch (error) {
    if (error.response) {
      console.error("Error response from API:", error.response.status);
      console.error("Error details:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error in setting up request:", error.message);
    }
  }
};

module.exports = { summarizeText };
