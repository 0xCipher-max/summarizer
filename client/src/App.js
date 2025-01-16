// src/App.js
import React, { useState } from "react";
import Layout from "./components/Layout";
import FileUpload from "./components/FileUpload";

const App = () => {
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file); // Use 'image' if the file is an image

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
    </Layout>
  );
};

export default App;
