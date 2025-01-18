// src/components/Layout.js
import React from "react";
import { Container, AppBar, Toolbar, Typography } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Container maxWidth="md">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Text Extractor & Summarizer</Typography>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </Container>
  );
};

export default Layout;
