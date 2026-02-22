const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const { connect, db } = require("../db");

const { user: User, product: Product, category: Category, review: Review, order: Order, wishlist: Wishlist } = db;

const dataPath = path.join(__dirname, "../../data.json");
const rawData = fs.readFileSync(dataPath, "utf-8");
const { products: productsData } = JSON.parse(rawData);

const seed = async () => {
  try {
    // Connect to database
    await connect();

    // 1. Drop all data
    console.log("🗑️ Clearing existing database collections...");
    
    // Using deleteMany instead of dropDatabase to keep indexes if they exist
    // and to be more controlled about which collections we clear.
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Wishlist.deleteMany({});
    
    console.log("✅ Collections cleared!");

    // 2. Create Users
    console.log("👤 Creating users...");
    const users = [];
    
    // Create an Admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@sopyshop.com",
      phone: "9876543210",
      dob: new Date("1995-01-01"),
      password: adminPassword,
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    });
    users.push(admin);

    // Create some regular test users
    for (let i = 0; i < 5; i++) {
      const password = await bcrypt.hash("password123", 10);
      const user = await User.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.string.numeric(10), // Ensures 10 digit phone number as per regex in model
        dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        password,
        role: "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`
      });
      users.push(user);
    }
    console.log(`✅ ${users.length} users created (including 1 admin)!`);

    // 3. Create Categories
    console.log("📂 Creating categories from product data...");
    const uniqueCategoryNames = [...new Set(productsData.map(p => p.category))];
    const categoryMap = {};

    for (const catName of uniqueCategoryNames) {
      const category = await Category.create({
        name: catName,
        description: `Premium selection of ${catName} products.`,
        image: {
          url: `https://api.dicebear.com/7.x/icons/svg?seed=${catName.replace(/\s+/g, '')}`
        }
      });
      categoryMap[catName] = category._id;
    }
    console.log(`✅ ${Object.keys(categoryMap).length} categories created!`);

    // 4. Create Products
    console.log("📦 Creating products...");
    const productsToCreate = productsData.map(p => {
      return {
        name: p.title,
        description: p.description,
        price: p.price,
        ratings: p.rating,
        images: p.images.map(img => ({ url: img })),
        category: categoryMap[p.category],
        stock: p.stock,
        numOfReviews: p.reviews.length,
        user: admin._id // Assign products to the admin user
      };
    });

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`✅ ${createdProducts.length} products created!`);

    // 5. Create Reviews
    console.log("📝 Seeding reviews...");
    const reviewsToCreate = [];
    productsData.forEach((productData, index) => {
      const productId = createdProducts[index]._id;
      
      productData.reviews.forEach(reviewData => {
        // Pick a random user from our created users list for each review
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        reviewsToCreate.push({
          user: randomUser._id,
          product: productId,
          name: reviewData.reviewerName,
          rating: reviewData.rating,
          comment: reviewData.comment
        });
      });
    });

    await Review.insertMany(reviewsToCreate);
    console.log(`✅ ${reviewsToCreate.length} reviews seeded!`);

    console.log("\n✨ Database seeding completed successfully!");
    console.log("------------------------------------------");
    console.log(`Admin Email: admin@sopyshop.com`);
    console.log(`Admin Password: admin123`);
    console.log("------------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();