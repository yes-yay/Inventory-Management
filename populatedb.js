const mongoose = require('mongoose');
const Category = require('./models/category');
const Item = require('./models/item');

// Connect to MongoDB
const mongoDB = 'mongodb+srv://admin:admin@cluster0.iolzk5i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Sample categories data
const categories = [
  { name: 'Electronics', description: 'Electronic gadgets and devices' },
  { name: 'Books', description: 'Books of various genres' },
  { name: 'Clothing', description: 'Apparel and accessories' },
  { name: 'Toys', description: 'Children\'s toys and games' },
  { name: 'Furniture', description: 'Home and office furniture' }
];

// Sample items data with associated category names
const items = [
  { name: 'Laptop', description: 'High-performance laptop', categoryName: 'Electronics', price: 1500, number_in_stock: 10 },
  { name: 'Mobile Phone', description: 'Latest smartphone model', categoryName: 'Electronics', price: 800, number_in_stock: 20 },
  { name: 'Science Fiction Book', description: 'Sci-fi novel by famous author', categoryName: 'Books', price: 20, number_in_stock: 30 },
  { name: 'T-shirt', description: 'Comfortable cotton T-shirt', categoryName: 'Clothing', price: 15, number_in_stock: 50 },
  { name: 'Action Figure', description: 'Collectible action figure', categoryName: 'Toys', price: 25, number_in_stock: 15 },
  { name: 'Desk', description: 'Modern office desk', categoryName: 'Furniture', price: 200, number_in_stock: 5 },
  { name: 'Headphones', description: 'Noise-cancelling headphones', categoryName: 'Electronics', price: 100, number_in_stock: 30 },
  { name: 'Cookbook', description: 'Collection of recipes', categoryName: 'Books', price: 30, number_in_stock: 25 },
  { name: 'Sneakers', description: 'Sports shoes', categoryName: 'Clothing', price: 50, number_in_stock: 40 },
];

// Function to create categories
async function createCategories() {
  try {
    await Category.deleteMany(); // Clear existing categories
    const createdCategories = await Category.create(categories);
    console.log(`Created ${createdCategories.length} categories`);
    return createdCategories;
  } catch (err) {
    console.error('Error creating categories:', err);
    throw err;
  }
}

// Function to create items with associated categories
async function createItems(createdCategories) {
  try {
    await Item.deleteMany(); // Clear existing items

    // Map items array to include category IDs based on created categories
    const itemsWithCategories = items.map(item => {
      const category = createdCategories.find(cat => cat.name === item.categoryName);
      if (!category) {
        throw new Error(`Category '${item.categoryName}' not found.`);
      }
      return {
        name: item.name,
        description: item.description,
        category: category._id,
        price: item.price,
        number_in_stock: item.number_in_stock
      };
    });

    const createdItems = await Item.create(itemsWithCategories);
    console.log(`Created ${createdItems.length} items`);

    return createdItems;
  } catch (err) {
    console.error('Error creating items:', err);
    throw err;
  }
}

// Function to populate the database
async function populateDatabase() {
  try {
    const createdCategories = await createCategories();
    await createItems(createdCategories);
    console.log('Database populated successfully');
  } catch (err) {
    console.error('Error populating database:', err);
  } finally {
    // Close the connection after population
    mongoose.connection.close();
  }
}

// Execute population
populateDatabase();
