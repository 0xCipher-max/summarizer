import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .png, .jpg, .jpeg",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    if (file) {
      setIsLoading(true);
      await onFileUpload(file, summaryLength);
      setIsLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ marginTop: "20px" }}
    >
      {/* Header Section */}
      <Grid item xs={12}>
        <Typography variant="h6" align="center">
          Upload a PDF or Image File
        </Typography>
      </Grid>

      {/* Drag-and-Drop Area */}
      <Grid item xs={12} sm={8} md={6}>
        <Tooltip title="Drag & drop a file or click to select" placement="top">
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #000",
              padding: "20px",
              textAlign: "center",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body1">
              Drag & drop a file here, or click to select a file
            </Typography>
            {file && (
              <Typography variant="body2" style={{ marginTop: "10px" }}>
                Selected File: {file.name}
              </Typography>
            )}
          </div>
        </Tooltip>
      </Grid>

      {/* Summary Length Dropdown */}
      <Grid item xs={12} sm={4} md={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="summary-length-label">Summary Length</InputLabel>
          <Select
            labelId="summary-length-label"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            label="Summary Length"
          >
            <MenuItem value="short">Short</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="long">Long</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Upload Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default FileUpload;
