const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");
const User = require("./src/models/User");
const Product = require("./src/models/Product");
const Order = require("./src/models/Order");
const Category = require("./src/models/Category");
const Review = require("./src/models/Review");
const Wishlist = require("./src/models/Wishlist");

dotenv.config();

const imagesSoaps = [
  "https://images.unsplash.com/photo-1618840313409-66c0d92d6f26",
  "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f",
  "https://images.unsplash.com/photo-1603533627544-4b256401b1ee",
  "https://images.unsplash.com/photo-1607006344920-4dbba33bd9d2",
  "https://images.unsplash.com/photo-1605265058749-78af14a1be2b"
];

const imagesBathSalts = [
  "https://images.unsplash.com/photo-1580437082423-4f0e58a2d413",
  "https://images.unsplash.com/photo-1663181596822-2c39582a9053",
  "https://images.unsplash.com/photo-1610564319542-1ed0efd044d5",
  "https://images.unsplash.com/photo-1550623685-2227f7bbef18",
  "https://images.unsplash.com/photo-1554167838-07aa5723df3a"
];

const imagesEssentialOils = [
  "https://images.unsplash.com/photo-1608571702346-bf078a741b19",
  "https://images.unsplash.com/photo-1638609927093-fc8ac17d3295",
  "https://images.unsplash.com/photo-1638609927127-aeb9e74c3cfd",
  "https://images.unsplash.com/photo-1605039996729-91290de2cac4",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15"
];

const imagesGiftSets = [
  "https://images.unsplash.com/photo-1766727923624-2e8eede5aa8c",
  "https://images.unsplash.com/photo-1639422742213-cb2f9a99d3f0",
  "https://images.unsplash.com/photo-1764607360436-2cbef672cc2c",
  "https://images.unsplash.com/photo-1671749999622-4087a86868cc",
  "https://images.unsplash.com/photo-1621533748467-27c570b23883"
];

const imagesClothes = [
    "https://images.unsplash.com/photo-1638107891841-33ffe333bbdb",
    "https://images.unsplash.com/photo-1657212458089-403a20058188",
    "https://images.unsplash.com/photo-1646855350893-6aec39a1e17b",
    "https://images.unsplash.com/photo-1584486520270-19eca1efcce5",
    "https://images.unsplash.com/photo-1539609400500-dc504dfc9896"
];

const imagesShoes = [
    "https://images.unsplash.com/photo-1609018997180-dc54c27521de",
    "https://images.unsplash.com/photo-1572045800968-4730d647d9da",
    "https://images.unsplash.com/photo-1589404923459-9abb2871f004",
    "https://images.unsplash.com/photo-1570970349586-b7ad0dde8432",
    "https://images.unsplash.com/photo-1707676179930-b2a8d251288a"
];

const imagesPhones = [
    "https://images.unsplash.com/photo-1565263965454-a44e2ede252a",
    "https://images.unsplash.com/photo-1653629213421-83a13907003f",
    "https://images.unsplash.com/photo-1621691187532-bbeb671757ac",
    "https://images.unsplash.com/photo-1624133525445-d6f13e059c6a",
    "https://images.unsplash.com/photo-1634423384351-e9c8da2f30e6"
];

const imagesLaptops = [
    "https://images.unsplash.com/photo-1720556405438-d67f0f9ecd44",
    "https://images.unsplash.com/photo-1543297088-974cee3f2156",
    "https://images.unsplash.com/photo-1614624532983-4ce03382d63d",
    "https://images.unsplash.com/photo-1601656269222-fda862e6dc7d",
    "https://images.unsplash.com/photo-1614624533048-a9c2f9cb5a96"
];

const imagesAvatars = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f",
  "https://images.unsplash.com/photo-1593628525442-f94a810619e0",
  "https://images.unsplash.com/photo-1599153511613-051d6e42ac70"
];

const seedData = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb+srv://prayansh:Prayansh8@cluster0.ynlykdk.mongodb.net/sopyshop?appName=Cluster0";
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB for seeding...");

    // 1. Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();
    console.log("Cleared all collections.");

    // 2. Create Categories
    const categoryData = [
      { name: "Luxury Soaps", description: "Handcrafted organic soaps with premium oils", image: { url: imagesSoaps[0] } },
      { name: "Bath Salts", description: "Relaxing therapeutic bath salts", image: { url: imagesBathSalts[0] } },
      { name: "Essential Oils", description: "Pure distilled plant extracts", image: { url: imagesEssentialOils[0] } },
      { name: "Gift Sets", description: "Pre-packaged luxury for your loved ones", image: { url: imagesGiftSets[0] } },
      { name: "Clothes", description: "Minimalist eco-friendly apparel", image: { url: imagesClothes[0] } },
      { name: "Shoes", description: "Comfortable and stylish footwear", image: { url: imagesShoes[0] } },
      { name: "Phones", description: "Latest smartphone technology", image: { url: imagesPhones[0] } },
      { name: "Laptops", description: "Powerful machines for work and play", image: { url: imagesLaptops[0] } }
    ];
    const createdCategories = await Category.insertMany(categoryData);
    console.log("Created 8 categories.");

    // 3. Create Users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // Admin user
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@sopyshop.com",
      phone: "9999999999",
      dob: new Date("1990-01-01"),
      password: hashedPassword,
      role: "admin",
      avatar: imagesAvatars[0]
    });

    // Regular users
    const users = [admin];
    for (let i = 0; i < 9; i++) {
        const user = await User.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            password: hashedPassword,
            role: "user",
            avatar: imagesAvatars[(i + 1) % imagesAvatars.length]
        });
        users.push(user);
    }
    console.log("Created 10 users.");

    // 4. Create Products
    const productsToCreate = [];
    const catConfigs = {
        "Luxury Soaps": { images: imagesSoaps, minPrice: 249, maxPrice: 999 },
        "Bath Salts": { images: imagesBathSalts, minPrice: 199, maxPrice: 799 },
        "Essential Oils": { images: imagesEssentialOils, minPrice: 499, maxPrice: 2499 },
        "Gift Sets": { images: imagesGiftSets, minPrice: 999, maxPrice: 4999 },
        "Clothes": { images: imagesClothes, minPrice: 499, maxPrice: 3499 },
        "Shoes": { images: imagesShoes, minPrice: 1499, maxPrice: 12999 },
        "Phones": { images: imagesPhones, minPrice: 9999, maxPrice: 149999 },
        "Laptops": { images: imagesLaptops, minPrice: 29999, maxPrice: 249999 }
    };

    for (let i = 0; i < 80; i++) {
        const cat = createdCategories[i % createdCategories.length];
        const config = catConfigs[cat.name];
        const imageUrl = config.images[Math.floor(Math.random() * config.images.length)];
        
        productsToCreate.push({
            name: `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
            description: faker.commerce.productDescription(),
            price: Math.floor(Math.random() * (config.maxPrice - config.minPrice + 1)) + config.minPrice,
            ratings: 0, // Will be updated by reviews
            images: [{ url: imageUrl }],
            category: cat.name,
            stock: Math.floor(Math.random() * 100) + 1,
            numOfReviews: 0,
            user: admin._id
        });
    }

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log("Created 80 products.");

    // 5. Create Reviews
    const reviewsToCreate = [];
    for (const product of createdProducts) {
        const numReviews = Math.floor(Math.random() * 5); // 0 to 4 reviews
        let totalRating = 0;
        
        for (let j = 0; j < numReviews; j++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const rating = Math.floor(Math.random() * 2) + 4; // 4 to 5 stars for that premium feel
            reviewsToCreate.push({
                user: randomUser._id,
                product: product._id,
                name: `${randomUser.firstName} ${randomUser.lastName}`,
                rating: rating,
                comment: faker.lorem.sentence()
            });
            totalRating += rating;
        }

        if (numReviews > 0) {
            product.ratings = parseFloat((totalRating / numReviews).toFixed(1));
            product.numOfReviews = numReviews;
            await product.save();
        }
    }
    await Review.insertMany(reviewsToCreate);
    console.log("Created reviews and updated product ratings.");

    // 6. Create Orders
    const ordersToCreate = [];
    const statusList = ["Processing", "Shipped", "Delivered"];

    for (let i = 0; i < 20; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const numItems = Math.floor(Math.random() * 3) + 1;
        const orderItems = [];
        let itemPrice = 0;

        for (let j = 0; j < numItems; j++) {
            const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            
            orderItems.push({
                name: randomProduct.name,
                price: randomProduct.price,
                quantity: quantity,
                image: randomProduct.images[0].url,
                product: randomProduct._id
            });
            itemPrice += randomProduct.price * quantity;
        }

        const taxPrice = itemPrice * 0.18;
        const shippingPrice = itemPrice > 1000 ? 0 : 150;
        const totalPrice = itemPrice + taxPrice + shippingPrice;

        ordersToCreate.push({
            shippingInfo: {
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                pinCode: 400001,
                phone: 9876543210
            },
            orderItems,
            user: randomUser._id,
            paymentInfo: {
                id: `pi_${faker.string.alphanumeric(20)}`,
                status: "succeeded"
            },
            paidAt: new Date(),
            itemPrice: itemPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
            orderStatus: statusList[Math.floor(Math.random() * statusList.length)]
        });
    }

    await Order.insertMany(ordersToCreate);
    console.log("Created 20 orders.");

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
