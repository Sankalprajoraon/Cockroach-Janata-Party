// ============================================
//  server.js — Express server for AWS Elastic Beanstalk
//  Serves the static HTML/CSS/JS website
// ============================================

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 8080;   // Elastic Beanstalk uses PORT env var

// Serve all static files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname)));

// Health check route — AWS uses this to verify app is running
app.get('/health', (req, res) => {
  res.status(200).json({
    status : 'UP',
    party  : 'Cockroach Janata Party',
    slogan : 'Survive. Thrive. Multiply.'
  });
});

// Catch-all: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🪳 CJP Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
