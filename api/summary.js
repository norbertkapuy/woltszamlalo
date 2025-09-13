import { initializeData, readData } from '../utils/data.js';

// Initialize data on startup
initializeData();

export default function handler(req, res) {
  // Get summary data
  try {
    const { month } = req.query;
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
    
    res.status(200).json({
      orderCount,
      totalAmount,
      averageAmount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}