let items = [
  { id: 1, name: 'Apple', category: 'Fruit' },
  { id: 2, name: 'Banana', category: 'Fruit' },
  { id: 3, name: 'Broccoli', category: 'Vegetable' },
];
let nextId = 4;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const findItems = async (filter = {}) => {
  await delay(50); // Simulate DB query time
  // Basic filtering example (can be extended for Feature 2)
  let results = [...items];
  if (filter.category) {
    results = results.filter(
      (i) => i.category.toLowerCase() === filter.category.toLowerCase()
    );
  }
  console.log(`Store: Found ${results.length} items with filter`, filter);
  return results;
};

export const findItemById = async (id) => {
  await delay(30);
  const item = items.find((i) => i.id === id);
  console.log(`Store: Finding item by id ${id}`, item ? 'Found' : 'Not Found');
  return item ? { ...item } : null; // Return copy
};

export const createItem = async (itemData) => {
  await delay(60);
  const newItem = { ...itemData, id: nextId++ };
  items.push(newItem);
  console.log('Store: Created item', newItem);
  return { ...newItem }; // Return copy
};

export const updateItem = async (id, updateData) => {
  await delay(70);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updateData };
  console.log('Store: Updated item', items[index]);
  return { ...items[index] }; // Return copy
};

export const deleteItem = async (id) => {
  await delay(40);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false; // Indicate not found
  items.splice(index, 1);
  console.log(`Store: Deleted item with id ${id}`);
  return true; // Indicate success
};
