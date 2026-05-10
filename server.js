require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDb, getDbConnection } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
initDb().catch(err => console.error('Failed to initialize database', err));

// Endpoint 1: Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Endpoint 2: Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const db = await getDbConnection();
        const expenses = await db.all('SELECT * FROM expenses ORDER BY date DESC, id DESC');
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Endpoint 3: Add new expense
app.post('/api/expenses', async (req, res) => {
    const { title, amount, date, category } = req.body;
    
    if (!title || !amount || !date) {
        return res.status(400).json({ error: 'Title, amount, and date are required' });
    }

    try {
        const db = await getDbConnection();
        const result = await db.run(
            'INSERT INTO expenses (title, amount, date, category) VALUES (?, ?, ?, ?)',
            [title, amount, date, category || 'Lainnya']
        );
        res.status(201).json({ id: result.lastID, message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// Endpoint 4: Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const db = await getDbConnection();
        const result = await db.run('DELETE FROM expenses WHERE id = ?', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
