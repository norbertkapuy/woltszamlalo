import { initializeData, readData } from '../utils/data.js';

// Initialize data on startup
initializeData();

export default function handler(req, res) {
  // Get available months
  try {
    const expenses = readData();
    
    // Extract unique months from expenses
    const months = [...new Set(
      expenses
        .filter(expense => expense.date)
        .map(expense => expense.date.substring(0, 7))
    )].sort((a, b) => b.localeCompare(a)); // Sort descending
    
    res.status(200).json(months);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}