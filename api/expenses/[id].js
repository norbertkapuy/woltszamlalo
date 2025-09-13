import { initializeData, readData, writeData } from '../../utils/data.js';

// Initialize data on startup
initializeData();

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    // Delete an expense
    try {
      const id = parseInt(req.query.id);
      let expenses = readData();
      
      const initialLength = expenses.length;
      expenses = expenses.filter(expense => expense.id !== id);
      
      if (expenses.length === initialLength) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      
      if (writeData(expenses)) {
        res.status(200).json({ deletedID: id });
      } else {
        res.status(500).json({ error: 'Failed to delete expense' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}