import { initializeData, readData, writeData } from '../utils/data.js';

// Initialize data on startup
initializeData();

export default function handler(req, res) {
  // Get all expenses
  try {
    const expenses = readData();
    // Sort by date descending
    const sortedExpenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(sortedExpenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}