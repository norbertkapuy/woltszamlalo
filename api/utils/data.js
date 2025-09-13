const fs = require('fs');

// Helper functions for file-based storage
const dataFile = '/tmp/expenses.json'; // Use /tmp directory which is writable

// Initialize data file if it doesn't exist
function initializeData() {
  // In Vercel, we might not be able to persist data between requests
  // But we can still try to use the file system
  try {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Error initializing data file:', err);
    // If we can't write to the file system, we'll use an in-memory store
    // This won't persist between requests but will at least allow the app to run
    global.expensesData = global.expensesData || [];
  }
}

// Read data from file
function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data file:', err);
    // Return in-memory data if file operations fail
    return global.expensesData || [];
  }
}

// Write data to file
function writeData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing data file:', err);
    // Store in memory if file operations fail
    global.expensesData = data;
    return true; // Return true to indicate success even if file write failed
  }
}

module.exports = {
  initializeData,
  readData,
  writeData
};