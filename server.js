const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Create or connect to SQLite database
const db = new sqlite3.Database('expenses.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create expenses table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Expenses table ready.');
      }
    });
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// API Routes

// Get all expenses
app.get('/api/expenses', (req, res) => {
  const sql = 'SELECT * FROM expenses ORDER BY date DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new expense
app.post('/api/expenses', (req, res) => {
  const { date, amount, description } = req.body;
  const sql = 'INSERT INTO expenses (date, amount, description) VALUES (?, ?, ?)';
  const params = [date, amount, description];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id: this.lastID,
      date,
      amount,
      description
    });
  });
});

// Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM expenses WHERE id = ?';
  
  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// Get summary data
app.get('/api/summary', (req, res) => {
  const month = req.query.month;
  let sql, params;
  
  if (month) {
    // Get summary for a specific month
    sql = `SELECT 
             COUNT(*) as orderCount,
             SUM(amount) as totalAmount,
             AVG(amount) as averageAmount
           FROM expenses 
           WHERE strftime('%Y-%m', date) = ?`;
    params = [month];
  } else {
    // Get summary for all time
    sql = `SELECT 
             COUNT(*) as orderCount,
             SUM(amount) as totalAmount,
             AVG(amount) as averageAmount
           FROM expenses`;
    params = [];
  }
  
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Handle case where there are no expenses
    if (!row.orderCount) {
      row = {
        orderCount: 0,
        totalAmount: 0,
        averageAmount: 0
      };
    }
    
    res.json(row);
  });
});

// Get available months
app.get('/api/months', (req, res) => {
  const sql = `SELECT DISTINCT strftime('%Y-%m', date) as month 
               FROM expenses 
               WHERE date IS NOT NULL 
               ORDER BY month DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const months = rows.map(row => row.month);
    res.json(months);
  });
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});