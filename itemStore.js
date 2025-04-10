// In-memory store for items
let items = new Map();
let nextId = 1;

// Find items with optional filters
export const findItems = async (filters = {}) => {
  let result = Array.from(items.values());

  if (filters.category) {
    result = result.filter((item) => item.category === filters.category);
  }
  if (filters.name) {
    result = result.filter((item) => item.name.includes(filters.name));
  }

  return result;
};

// Find a single item by ID
export const findItemById = async (id) => {
  return items.get(id);
};

// Create a new item
export const createItem = async (itemData) => {
  const id = nextId++;
  const item = { id, ...itemData };
  items.set(id, item);
  return item;
};

// Update an existing item
export const updateItem = async (id, updates) => {
  const item = items.get(id);
  if (!item) return null;

  const updatedItem = { ...item, ...updates };
  items.set(id, updatedItem);
  return updatedItem;
};

// Delete an item
export const deleteItem = async (id) => {
  const deleted = items.delete(id);
  return deleted;
};
