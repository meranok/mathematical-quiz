const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve all files from the current directory
app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});