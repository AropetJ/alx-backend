#!/usr/bin/env node
import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5
  },
];

/**
 * Retrieves an item by its ID.
 * @param {number} id - The ID of the item to retrieve.
 * @returns {Object} The item object if found, otherwise undefined.
 */
const getItemById = (id) => {
  return listProducts.find(obj => obj.itemId === id);
};

const app = express();
const client = createClient();
const PORT = process.env.PORT || 1245;

/**
 * Modifies the reserved stock for a given item.
 * @param {number} itemId - The ID of the item.
 * @param {number} stock - The new stock value.
 * @returns {Promise<String>} A promise representing the result of the operation.
 */
const reserveStockById = async (itemId, stock) => {
  return promisify(client.set).bind(client)(`item.${itemId}`, stock);
};

/**
 * Retrieves the reserved stock for a given item.
 * @param {number} itemId - The ID of the item.
 * @returns {Promise<String>} A promise representing the reserved stock.
 */
const getCurrentReservedStockById = async (itemId) => {
  return promisify(client.get).bind(client)(`item.${itemId}`);
};

// Define API routes
app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    productItem.currentQuantity = productItem.initialAvailableQuantity - (reservedStock ? parseInt(reservedStock) : 0);
    res.json(productItem);
  } catch (error) {
    console.error('Error retrieving reserved stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const newReservedStock = (reservedStock ? parseInt(reservedStock) : 0) + 1;

    if (newReservedStock >= productItem.initialAvailableQuantity) {
      res.json({ status: 'Not enough stock available', itemId });
      return;
    }

    await reserveStockById(itemId, newReservedStock);
    res.json({ status: 'Reservation confirmed', itemId });
  } catch (error) {
    console.error('Error reserving product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Resets the stock of all products to 0.
 * @returns {Promise<void>} A promise representing the completion of the operation.
 */
const resetProductsStock = async () => {
  try {
    await Promise.all(
      listProducts.map(item => promisify(client.set).bind(client)(`item.${item.itemId}`, 0))
    );
    console.log(`Products stock reset successfully`);
  } catch (error) {
    console.error('Error resetting products stock:', error);
  }
};

// Start the server
app.listen(PORT, async () => {
  try {
    await resetProductsStock();
    console.log(`API available on localhost port ${PORT}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
});

export default app;
