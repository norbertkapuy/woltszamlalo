const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Serve the index.html file for the root path
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, '..', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error loading page');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(data);
    });
    return;
  }
  
  // For API routes, let them be handled by Vercel
  res.status(404).send('Not found');
};