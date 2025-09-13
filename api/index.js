const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Serve the index.html file
  const filePath = path.join(__dirname, '..', 'index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading page');
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(data);
  });
};