const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Helper functions for file-based storage
const dataFile = 'expenses.json';

// Initialize data file if it doesn't exist
function initializeData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
}

// Read data from file
function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

// Write data to file
function writeData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing data:', err);
    return false;
  }
}

// Initialize data on startup
initializeData();

// API Routes

// Get all expenses
app.get('/api/expenses', (req, res) => {
  try {
    const expenses = readData();
    // Sort by date descending
    const sortedExpenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedExpenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new expense
app.post('/api/expenses', (req, res) => {
  try {
    const { date, amount, description } = req.body;
    const expenses = readData();
    
    const newExpense = {
      id: Date.now(), // Simple ID generation
      date,
      amount: parseFloat(amount),
      description: description || 'No description'
    };
    
    expenses.push(newExpense);
    
    if (writeData(expenses)) {
      res.json(newExpense);
    } else {
      res.status(500).json({ error: 'Failed to save expense' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let expenses = readData();
    
    const initialLength = expenses.length;
    expenses = expenses.filter(expense => expense.id !== id);
    
    if (expenses.length === initialLength) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    
    if (writeData(expenses)) {
      res.json({ deletedID: id });
    } else {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get summary data
app.get('/api/summary', (req, res) => {
  try {
    const month = req.query.month;
    const expenses = readData();
    
    // Filter by month if specified
    let filteredExpenses = expenses;
    if (month) {
      filteredExpenses = expenses.filter(expense => 
        expense.date.startsWith(month)
      );
    }
    
    // Calculate statistics
    const orderCount = filteredExpenses.length;
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = orderCount > 0 ? totalAmount / orderCount : 0;
    
    res.json({
      orderCount,
      totalAmount,
      averageAmount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available months
app.get('/api/months', (req, res) => {
  try {
    const expenses = readData();
    
    // Extract unique months from expenses
    const months = [...new Set(
      expenses
        .filter(expense => expense.date)
        .map(expense => expense.date.substring(0, 7))
    )].sort((a, b) => b.localeCompare(a)); // Sort descending
    
    res.json(months);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// For Vercel, we need to export the app
module.exports = app;