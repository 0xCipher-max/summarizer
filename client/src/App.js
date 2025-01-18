import React, { useState } from "react";
import Layout from "./components/Layout";
import FileUpload from "./components/FileUpload";

const App = () => {
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState([]); // State for key points

  const handleFileUpload = async (file, summaryLength) => {
    const formData = new FormData();

    // Determine the file type and append it to the form data
    if (file.type === "application/pdf") {
      formData.append("pdf", file);
    } else if (file.type.startsWith("image/")) {
      formData.append("image", file);
    } else {
      console.error("Unsupported file type");
      return;
    }

    // Append the summary length to the form data
    formData.append("summaryLength", summaryLength);

    try {
      const response = await fetch(
        "http://localhost:5000/api/extract-and-summarize",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract and summarize text.");
      }

      const data = await response.json();
      setExtractedText(data.extractedText);
      setSummary(data.summary);
      setKeyPoints(data.keyPoints); // Store key points from the response
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <FileUpload onFileUpload={handleFileUpload} />
      {extractedText && (
        <div>
          <h2>Extracted Text</h2>
          <p>{extractedText}</p>
        </div>
      )}
      {summary && (
        <div>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
      {keyPoints.length > 0 && (
        <div>
          <h2>Key Points</h2>
          <ul>
            {keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default App;
