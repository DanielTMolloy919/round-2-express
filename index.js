import express from 'express';
import { requestLogger, loadItem, checkAdmin } from './middleware.js';
import { findItems, createItem, updateItem, deleteItem } from './itemStore.js';

const app = express();
const port = 3010;

app.use(express.json()); // Parse JSON bodies
app.use(requestLogger); // Log all requests

// Routes
app.get('/api/items', async (req, res) => {
  try {
    // Feature 2: Pass query params to filter
    const items = await findItems(req.query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items' });
  }
});

app.post('/api/items', async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }
  try {
    const newItem = await createItem({ name, category });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item' });
  }
});

// Routes requiring a specific item ID
// Using loadItem middleware first
app.get('/api/items/:id', loadItem, (req, res) => {
  // Item is loaded by middleware and attached to req.item
  res.json(req.item);
});

// BUG: checkAdmin middleware runs AFTER loadItem, but has the bug
app.put('/api/items/:id', loadItem, checkAdmin, async (req, res) => {
  // If checkAdmin bug exists, this might run even for non-admins
  console.log('PUT handler running...'); // Check if this logs for non-admin
  const { name, category } = req.body;
  if (!name && !category) {
    return res.status(400).json({ message: 'Need name or category to update' });
  }
  try {
    const updatedItem = await updateItem(req.item.id, { name, category });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item' });
  }
});

// Feature 1: Add DELETE route
// app.delete('/api/items/:id', loadItem, checkAdmin, async (req, res) => { ... });

// Basic Error Handler (Optional but good practice)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// package.json - ensure type: module for ES imports
/*
{
  "name": "node-express-moderate",
  "version": "1.0.0",
  "type": "module", // <-- Important for ES modules
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2" // Or newer
  }
}
*/
