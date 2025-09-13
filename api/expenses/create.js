const { initializeData, readData, writeData } = require('../utils/data.js');

// Initialize data on startup
initializeData();

module.exports = function handler(req, res) {
  if (req.method === 'POST') {
    // Add a new expense
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
        res.status(200).json(newExpense);
      } else {
        res.status(500).json({ error: 'Failed to save expense' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}