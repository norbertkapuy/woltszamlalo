# Food Order Expense Tracker

A web application to track and calculate your food order expenses with a permanent database backend.

## Features

- Add food orders with date, amount, and description
- View all orders in a responsive interface
- Calculate monthly spending totals and averages
- Delete orders when needed
- Data is permanently stored in a SQLite database

## Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

1. Start the server:
   ```
   npm start
   ```
   or for development with auto-restart:
   ```
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Database

The application uses SQLite for data storage. The database file `expenses.db` will be automatically created when you run the application for the first time.

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add a new expense
- `DELETE /api/expenses/:id` - Delete an expense by ID
- `GET /api/summary` - Get summary statistics (all time or for a specific month)
- `GET /api/months` - Get available months with expenses

## File Structure

- `server.js` - Backend server with Express and SQLite
- `index.html` - Frontend HTML structure
- `styles.css` - Styling for the application
- `script.js` - Frontend JavaScript for UI interactions
- `expenses.db` - SQLite database (created automatically)
- `package.json` - Project dependencies and scripts

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite
- **API Communication**: Fetch API

## License

This project is open source and available under the MIT License.