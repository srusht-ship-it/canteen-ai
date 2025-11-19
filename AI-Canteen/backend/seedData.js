const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

dotenv.config();

// Sample data
const categories = [
  {
    name: 'Breakfast',
    description: 'Start your day right with our breakfast options',
    icon: '🍳',
    displayOrder: 1
  },
  {
    name: 'Lunch Specials',
    description: 'Hearty meals for your afternoon',
    icon: '🍱',
    displayOrder: 2
  },
  {
    name: 'Snacks',
    description: 'Quick bites between classes',
    icon: '🍟',
    displayOrder: 3
  },
  {
    name: 'Beverages',
    description: 'Refreshing drinks',
    icon: '🥤',
    displayOrder: 4
  },
  {
    name: 'Desserts',
    description: 'Sweet treats to satisfy your cravings',
    icon: '🍰',
    displayOrder: 5
  },
  {
    name: 'Salads & Bowls',
    description: 'Healthy and fresh options',
    icon: '🥗',
    displayOrder: 6
  }
];

const getMenuItems = (categoryIds) => [
  // Breakfast Items
  {
    name: 'Classic Masala Dosa',
    description: 'Crispy dosa filled with spiced potato masala, served with sambar and chutney',
    price: 60,
    category: categoryIds['Breakfast'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    ingredients: ['Rice batter', 'Potato', 'Onion', 'Spices'],
    allergens: [],
    nutritionInfo: { calories: 350, protein: 8, carbs: 65, fat: 7, fiber: 5 },
    prepTime: 15,
    isSpecial: true,
    isAvailable: true,
    ratings: { average: 4.5, count: 127 },
    totalOrders: 450
  },
  {
    name: 'Idli Sambar (3 pcs)',
    description: 'Soft steamed rice cakes served with sambar and coconut chutney',
    price: 40,
    category: categoryIds['Breakfast'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    ingredients: ['Rice', 'Urad dal', 'Lentils', 'Vegetables'],
    allergens: [],
    nutritionInfo: { calories: 200, protein: 6, carbs: 40, fat: 2, fiber: 4 },
    prepTime: 10,
    isAvailable: true,
    ratings: { average: 4.3, count: 98 },
    totalOrders: 380
  },
  {
    name: 'Poha with Tea',
    description: 'Flattened rice cooked with onions, peas, and spices',
    price: 35,
    category: categoryIds['Breakfast'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    ingredients: ['Flattened rice', 'Onions', 'Peas', 'Peanuts', 'Turmeric'],
    allergens: ['Peanuts'],
    nutritionInfo: { calories: 250, protein: 5, carbs: 45, fat: 6, fiber: 3 },
    prepTime: 12,
    isAvailable: true,
    ratings: { average: 4.2, count: 75 },
    totalOrders: 290
  },
  {
    name: 'Oats & Fruits Bowl',
    description: 'Nutritious oats topped with seasonal fruits and honey',
    price: 55,
    category: categoryIds['Breakfast'],
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Protein'],
    ingredients: ['Oats', 'Banana', 'Apple', 'Berries', 'Honey', 'Nuts'],
    allergens: ['Nuts'],
    nutritionInfo: { calories: 320, protein: 12, carbs: 55, fat: 8, fiber: 10 },
    prepTime: 8,
    isAvailable: true,
    ratings: { average: 4.6, count: 65 },
    totalOrders: 210
  },

  // Lunch Specials
  {
    name: 'Paneer Butter Masala with Rice',
    description: 'Cottage cheese in rich tomato-based gravy served with steamed rice',
    price: 90,
    category: categoryIds['Lunch Specials'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Paneer', 'Tomato', 'Cream', 'Butter', 'Spices', 'Rice'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 550, protein: 20, carbs: 65, fat: 22, fiber: 6 },
    prepTime: 20,
    isSpecial: true,
    isAvailable: true,
    ratings: { average: 4.7, count: 156 },
    totalOrders: 520
  },
  {
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry with fluffy fried bread',
    price: 75,
    category: categoryIds['Lunch Specials'],
    dietaryTags: ['Vegetarian', 'Vegan'],
    ingredients: ['Chickpeas', 'Flour', 'Onions', 'Tomatoes', 'Spices'],
    allergens: ['Gluten'],
    nutritionInfo: { calories: 600, protein: 18, carbs: 85, fat: 20, fiber: 12 },
    prepTime: 18,
    isAvailable: true,
    ratings: { average: 4.5, count: 142 },
    totalOrders: 480
  },
  {
    name: 'Veg Biryani with Raita',
    description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices',
    price: 85,
    category: categoryIds['Lunch Specials'],
    dietaryTags: ['Vegetarian', 'Vegan'],
    ingredients: ['Basmati rice', 'Mixed vegetables', 'Biryani spices', 'Saffron'],
    allergens: [],
    nutritionInfo: { calories: 480, protein: 12, carbs: 78, fat: 14, fiber: 8 },
    prepTime: 25,
    isSpecial: true,
    isAvailable: true,
    ratings: { average: 4.6, count: 189 },
    totalOrders: 620
  },
  {
    name: 'South Indian Thali',
    description: 'Complete meal with sambar rice, curd rice, 2 curries, papad, and pickle',
    price: 95,
    category: categoryIds['Lunch Specials'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Rice', 'Dal', 'Vegetables', 'Yogurt', 'Spices'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 620, protein: 18, carbs: 95, fat: 18, fiber: 10 },
    prepTime: 20,
    isAvailable: true,
    ratings: { average: 4.8, count: 203 },
    totalOrders: 710
  },

  // Snacks
  {
    name: 'Samosa (2 pcs)',
    description: 'Crispy pastry filled with spiced potato and peas',
    price: 25,
    category: categoryIds['Snacks'],
    dietaryTags: ['Vegetarian', 'Vegan'],
    ingredients: ['Flour', 'Potato', 'Peas', 'Spices'],
    allergens: ['Gluten'],
    nutritionInfo: { calories: 280, protein: 5, carbs: 40, fat: 12, fiber: 4 },
    prepTime: 8,
    isAvailable: true,
    ratings: { average: 4.4, count: 245 },
    totalOrders: 890
  },
  {
    name: 'Vada Pav',
    description: 'Mumbai style potato fritter in a bun with chutneys',
    price: 30,
    category: categoryIds['Snacks'],
    dietaryTags: ['Vegetarian', 'Vegan'],
    ingredients: ['Potato', 'Bread', 'Chickpea flour', 'Chutney'],
    allergens: ['Gluten'],
    nutritionInfo: { calories: 320, protein: 7, carbs: 52, fat: 10, fiber: 5 },
    prepTime: 10,
    isAvailable: true,
    ratings: { average: 4.3, count: 198 },
    totalOrders: 650
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries with ketchup',
    price: 40,
    category: categoryIds['Snacks'],
    dietaryTags: ['Vegetarian', 'Vegan'],
    ingredients: ['Potato', 'Oil', 'Salt'],
    allergens: [],
    nutritionInfo: { calories: 365, protein: 4, carbs: 50, fat: 17, fiber: 5 },
    prepTime: 12,
    isAvailable: true,
    ratings: { average: 4.2, count: 176 },
    totalOrders: 580
  },
  {
    name: 'Paneer Tikka (6 pcs)',
    description: 'Grilled cottage cheese marinated in spices',
    price: 80,
    category: categoryIds['Snacks'],
    dietaryTags: ['Vegetarian', 'High-Protein', 'Keto'],
    ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell peppers', 'Onions'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 280, protein: 22, carbs: 12, fat: 18, fiber: 3 },
    prepTime: 15,
    isSpecial: true,
    isAvailable: true,
    ratings: { average: 4.7, count: 134 },
    totalOrders: 420
  },

  // Beverages
  {
    name: 'Masala Chai',
    description: 'Traditional Indian tea with aromatic spices',
    price: 15,
    category: categoryIds['Beverages'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Tea', 'Milk', 'Spices', 'Sugar'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 80, protein: 2, carbs: 15, fat: 2, fiber: 0 },
    prepTime: 5,
    isAvailable: true,
    ratings: { average: 4.5, count: 312 },
    totalOrders: 1200
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda and a hint of salt',
    price: 25,
    category: categoryIds['Beverages'],
    dietaryTags: ['Vegetarian', 'Vegan'],
    ingredients: ['Lime', 'Soda', 'Salt', 'Sugar'],
    allergens: [],
    nutritionInfo: { calories: 60, protein: 0, carbs: 15, fat: 0, fiber: 0 },
    prepTime: 3,
    isAvailable: true,
    ratings: { average: 4.3, count: 187 },
    totalOrders: 520
  },
  {
    name: 'Mango Lassi',
    description: 'Sweet and creamy yogurt drink with mango',
    price: 40,
    category: categoryIds['Beverages'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Yogurt', 'Mango', 'Sugar', 'Cardamom'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 180, protein: 6, carbs: 32, fat: 4, fiber: 1 },
    prepTime: 5,
    isAvailable: true,
    ratings: { average: 4.6, count: 156 },
    totalOrders: 480
  },
  {
    name: 'Cold Coffee',
    description: 'Chilled coffee with milk and ice cream',
    price: 50,
    category: categoryIds['Beverages'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Coffee', 'Milk', 'Ice cream', 'Sugar'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 220, protein: 5, carbs: 35, fat: 8, fiber: 0 },
    prepTime: 5,
    isAvailable: true,
    ratings: { average: 4.4, count: 198 },
    totalOrders: 620
  },

  // Desserts
  {
    name: 'Gulab Jamun (2 pcs)',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
    price: 35,
    category: categoryIds['Desserts'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Milk powder', 'Sugar', 'Rose water', 'Cardamom'],
    allergens: ['Dairy', 'Gluten'],
    nutritionInfo: { calories: 280, protein: 4, carbs: 50, fat: 8, fiber: 1 },
    prepTime: 8,
    isAvailable: true,
    ratings: { average: 4.5, count: 167 },
    totalOrders: 450
  },
  {
    name: 'Fruit Salad',
    description: 'Fresh seasonal fruits with a hint of lime and chaat masala',
    price: 45,
    category: categoryIds['Desserts'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    ingredients: ['Apple', 'Banana', 'Grapes', 'Pomegranate', 'Lime', 'Chaat masala'],
    allergens: [],
    nutritionInfo: { calories: 120, protein: 2, carbs: 30, fat: 0, fiber: 5 },
    prepTime: 5,
    isAvailable: true,
    ratings: { average: 4.4, count: 89 },
    totalOrders: 280
  },
  {
    name: 'Ice Cream Cup',
    description: 'Creamy vanilla ice cream',
    price: 30,
    category: categoryIds['Desserts'],
    dietaryTags: ['Vegetarian'],
    ingredients: ['Milk', 'Cream', 'Sugar', 'Vanilla'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 180, protein: 3, carbs: 22, fat: 9, fiber: 0 },
    prepTime: 2,
    isAvailable: true,
    ratings: { average: 4.2, count: 134 },
    totalOrders: 390
  },

  // Salads & Bowls
  {
    name: 'Quinoa Power Bowl',
    description: 'Quinoa with roasted vegetables, chickpeas, and tahini dressing',
    price: 95,
    category: categoryIds['Salads & Bowls'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein'],
    ingredients: ['Quinoa', 'Chickpeas', 'Broccoli', 'Bell peppers', 'Tahini'],
    allergens: ['Sesame'],
    nutritionInfo: { calories: 420, protein: 18, carbs: 58, fat: 14, fiber: 12 },
    prepTime: 15,
    isSpecial: true,
    isAvailable: true,
    ratings: { average: 4.8, count: 92 },
    totalOrders: 210
  },
  {
    name: 'Greek Salad',
    description: 'Fresh vegetables with feta cheese and olives',
    price: 85,
    category: categoryIds['Salads & Bowls'],
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Keto'],
    ingredients: ['Cucumber', 'Tomato', 'Onion', 'Feta cheese', 'Olives', 'Olive oil'],
    allergens: ['Dairy'],
    nutritionInfo: { calories: 280, protein: 12, carbs: 15, fat: 20, fiber: 5 },
    prepTime: 10,
    isAvailable: true,
    ratings: { average: 4.5, count: 76 },
    totalOrders: 190
  },
  {
    name: 'Sprout Salad',
    description: 'Mixed sprouts with onions, tomatoes, and lemon dressing',
    price: 50,
    category: categoryIds['Salads & Bowls'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein'],
    ingredients: ['Moong sprouts', 'Chickpea sprouts', 'Onion', 'Tomato', 'Lemon'],
    allergens: [],
    nutritionInfo: { calories: 180, protein: 14, carbs: 28, fat: 2, fiber: 8 },
    prepTime: 8,
    isAvailable: true,
    ratings: { average: 4.3, count: 68 },
    totalOrders: 160
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany();
    await MenuItem.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Create category ID map
    const categoryIds = {};
    insertedCategories.forEach(cat => {
      categoryIds[cat.name] = cat._id;
    });

    // Insert menu items
    const menuItems = getMenuItems(categoryIds);
    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${insertedItems.length} menu items`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Categories: ${insertedCategories.length}`);
    console.log(`- Menu Items: ${insertedItems.length}`);
    console.log('\nYou can now start using the application!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
