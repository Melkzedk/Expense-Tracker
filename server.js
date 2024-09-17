const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Expense schema
const expenseSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now },
});

// Create Expense model
const Expense = mongoose.model('Expense', expenseSchema);

// API Routes

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  const { amount, description } = req.body;
  const expense = new Expense({ amount, description });
  try {
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
