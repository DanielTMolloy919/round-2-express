import { findItemById } from './db.js';

export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

export const loadItem = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid item ID format' });
  }
  try {
    console.log(`Middleware: Attempting to load item ${id}`);
    const item = await findItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    req.item = item; // Attach item to request
    next();
  } catch (error) {
    console.error('Middleware Error:', error);
    res.status(500).json({ message: 'Internal server error during item load' });
  }
};

// BUG: Example of potentially problematic middleware
export const checkAdmin = (req, res, next) => {
  // In a real app, this would check auth headers, sessions etc.
  const isAdmin = req.query.admin === 'true'; // Simple check via query param
  console.log(
    `Middleware: Checking admin status (query=${req.query.admin}). Is admin? ${isAdmin}`
  );
  if (!isAdmin) {
    // BUG: Forgetting to return after sending response allows 'next()' below to run
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next(); // This will run even if status 403 was sent!
};
