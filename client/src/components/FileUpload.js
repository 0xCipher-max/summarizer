// src/components/FileUpload.js
import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h6">Upload a PDF or Image File</Typography>
      <input
        accept="application/pdf,image/*"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          Choose File
        </Button>
      </label>
      {file && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Selected File: {file.name}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ mt: 2 }}
        disabled={!file}
      >
        Upload
      </Button>
    </Box>
  );
};

export default FileUpload;
