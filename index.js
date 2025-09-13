const express = require('express');
const path = require('path');
const { initializeData } = require('./api/utils/data.js');

// Initialize data
initializeData();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API routes
app.get('/api/expenses', require('./api/expenses.js'));
app.post('/api/expenses/create', require('./api/expenses/create.js'));
app.delete('/api/expenses/:id', require('./api/expenses/[id].js'));
app.get('/api/summary', require('./api/summary.js'));
app.get('/api/months', require('./api/months.js'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all other routes by serving index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;