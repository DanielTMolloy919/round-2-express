import { findItemById } from "./db.js";

// Logs incoming requests with timestamp
export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

// Loads and validates item by ID from the database
export const loadItem = async (req, res, next) => {
  console.log(
    `[loadItem] START - Request for item ID: ${req.params.id} from ${req.ip}, URL: ${req.originalUrl}`
  );
  const startTime = Date.now();

  const id = parseInt(req.params.id, 10);
  console.log(`[loadItem] Parsed ID: ${id}, Original param: ${req.params.id}`);

  if (isNaN(id)) {
    console.log(`[loadItem] ERROR - Invalid ID format: "${req.params.id}"`);
    return res.status(400).json({ message: "Invalid item ID format" });
  }

  try {
    console.log(`[loadItem] Attempting database lookup for item ${id}`);
    const lookupStart = Date.now();
    const item = await findItemById(id);
    const lookupDuration = Date.now() - lookupStart;
    console.log(`[loadItem] Database lookup completed in ${lookupDuration}ms`);

    if (!item) {
      console.log(`[loadItem] Item with ID ${id} not found in database`);
      return res.status(404).json({ message: "Item not found" });
    }

    console.log(`[loadItem] Successfully found item: ${JSON.stringify(item)}`);
    req.item = item; // Attach item to request

    const totalDuration = Date.now() - startTime;
    console.log(
      `[loadItem] END - Successfully processed in ${totalDuration}ms, calling next()`
    );
    next();
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[loadItem] CRITICAL ERROR after ${totalDuration}ms:`, error);
    console.error(`[loadItem] Stack trace:`, error.stack);
    res.status(500).json({ message: "Internal server error during item load" });
  }
};

// Middleware to check if user has admin privileges
export const checkAdmin = (req, res, next) => {
  const isAdmin = req.query.admin === "true"; // Simple check via query param
  console.log(
    `Middleware: Checking admin status (query=${req.query.admin}). Is admin? ${isAdmin}`
  );
  if (!isAdmin) {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};
