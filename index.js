import express from "express";
import { requestLogger, loadItem, checkAdmin } from "./middleware.js";
import { findItems, createItem, updateItem, deleteItem } from "./itemStore.js";

const app = express();
const port = 3010;

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(requestLogger); // Log all requests

// GET all items with optional filters
app.get("/api/items", async (req, res) => {
  try {
    const items = await findItems(req.query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve items" });
  }
});

// Create new item
app.post("/api/items", async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: "Name and category are required" });
  }
  try {
    const newItem = await createItem({ name, category });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to create item" });
  }
});

// Get single item by ID
app.get("/api/items/:id", loadItem, (req, res) => {
  res.json(req.item);
});

// Update item by ID (admin only)
app.put("/api/items/:id", loadItem, checkAdmin, async (req, res) => {
  const { name, category } = req.body;
  if (!name && !category) {
    return res.status(400).json({ message: "Need name or category to update" });
  }
  try {
    const updatedItem = await updateItem(req.item.id, { name, category });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
