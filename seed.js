const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");
const User = require("./src/databases/modals/User");
const Product = require("./src/databases/modals/Product");
const Order = require("./src/databases/modals/Order");

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

const imagesClothesRed = [
    "https://images.unsplash.com/photo-1638107891841-33ffe333bbdb",
    "https://images.unsplash.com/photo-1657212458089-403a20058188",
    "https://images.unsplash.com/photo-1646855350893-6aec39a1e17b",
    "https://images.unsplash.com/photo-1584486520270-19eca1efcce5",
    "https://images.unsplash.com/photo-1539609400500-dc504dfc9896"
];

const imagesClothesBlue = [
    "https://images.unsplash.com/photo-1649675729118-6215b8d1f276",
    "https://images.unsplash.com/photo-1728485294270-a79c84584d54",
    "https://images.unsplash.com/photo-1650603698758-b4dc0351f207",
    "https://images.unsplash.com/photo-1634225222400-c1d62052ce11",
    "https://images.unsplash.com/photo-1560243563-062bfc001d68"
];

const imagesClothesBlack = [
    "https://images.unsplash.com/photo-1642229105108-8263fbb298a7",
    "https://images.unsplash.com/photo-1499971856191-1a420a42b498",
    "https://images.unsplash.com/photo-1737020383362-1bff76fde9f6",
    "https://images.unsplash.com/photo-1758221105152-272f3b257c1d",
    "https://images.unsplash.com/photo-1646178071012-7bf3efe0ddfa"
];

const imagesClothesGreen = [
    "https://images.unsplash.com/photo-1715246020788-803ff583efe4",
    "https://images.unsplash.com/photo-1610383689155-993c49ce7cfe",
    "https://images.unsplash.com/photo-1616115804836-397e9fcef8e9",
    "https://images.unsplash.com/photo-1601136610007-1ecf5706c908",
    "https://images.unsplash.com/photo-1749710764673-5ea534820e3a"
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

const imagesCameras = [
    "https://images.unsplash.com/photo-1608701033789-87fc1daea1c2",
    "https://images.unsplash.com/photo-1628163463242-e80f84ef0bc2",
    "https://images.unsplash.com/photo-1710391965697-209296010b85",
    "https://images.unsplash.com/photo-1678599694227-549a5420f352",
    "https://images.unsplash.com/photo-1631652645581-a4bc83d8911b"
];

const imagesHeadphones = [
    "https://images.unsplash.com/photo-1739764574592-1dcd5d978a53",
    "https://images.unsplash.com/photo-1670111782587-ae4378bbff59",
    "https://images.unsplash.com/photo-1675361384642-82832ca5374c",
    "https://images.unsplash.com/photo-1709330959861-ffcfa4b9757f",
    "https://images.unsplash.com/photo-1713403857782-80a39b5af884"
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
    await mongoose.connect(process.env.MONGO_URL || "mongodb+srv://prayansh:Prayansh8@cluster0.ynlykdk.mongodb.net/sopyshop?appName=Cluster0");
    console.log("Connected to MongoDB for seeding...");

    // 1. Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Cleared existing data.");

    // 2. Create Users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = [];

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
    users.push(admin);

    // Regular users
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

    // 3. Create Products
    const productsToCreate = [];
    const categories = [
        { name: "Luxury Soaps", images: imagesSoaps, minPrice: 249, maxPrice: 999 },
        { name: "Bath Salts", images: imagesBathSalts, minPrice: 199, maxPrice: 799 },
        { name: "Essential Oils", images: imagesEssentialOils, minPrice: 499, maxPrice: 2499 },
        { name: "Spa Gift Sets", images: imagesGiftSets, minPrice: 999, maxPrice: 4999 },
        { name: "Clothes", images: [...imagesClothesRed, ...imagesClothesBlue, ...imagesClothesBlack, ...imagesClothesGreen], minPrice: 499, maxPrice: 3499 },
        { name: "Shoes", images: imagesShoes, minPrice: 1499, maxPrice: 12999 },
        { name: "Phone", images: imagesPhones, minPrice: 9999, maxPrice: 149999 },
        { name: "Laptop", images: imagesLaptops, minPrice: 29999, maxPrice: 249999 },
        { name: "Camera", images: imagesCameras, minPrice: 34999, maxPrice: 499999 },
        { name: "Headphones", images: imagesHeadphones, minPrice: 999, maxPrice: 34999 }
    ];

    // Create 100 products for better variety
    for (let i = 0; i < 100; i++) {
        const categoryObj = categories[i % categories.length];
        const imageUrl = categoryObj.images[Math.floor(Math.random() * categoryObj.images.length)];
        
        productsToCreate.push({
            name: `${faker.commerce.productAdjective()} ${faker.commerce.productName()} (${categoryObj.name})`,
            description: faker.commerce.productDescription(),
            price: Math.floor(Math.random() * (categoryObj.maxPrice - categoryObj.minPrice + 1)) + categoryObj.minPrice,
            ratings: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
            images: [{ url: imageUrl }],
            category: categoryObj.name,
            stock: Math.floor(Math.random() * 100) + 1,
            numOfReviews: 0,
            reviews: [],
            user: admin._id
        });
    }

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log("Created 100 products.");

    // 4. Create Orders
    const ordersToCreate = [];
    const orderStatuses = ["Processing", "Shipped", "Delivered"];

    for (let i = 0; i < 30; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const numItems = Math.floor(Math.random() * 4) + 1;
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
        const shippingPrice = itemPrice > 1000 ? 0 : 100;
        const totalPrice = itemPrice + taxPrice + shippingPrice;

        ordersToCreate.push({
            shippingInfo: {
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                pinCode: parseInt(faker.location.zipCode('######')),
                phone: parseInt(randomUser.phone)
            },
            orderItems,
            user: randomUser._id,
            paymentInfo: {
                id: `pi_${faker.string.alphanumeric(24)}`,
                status: "succeeded"
            },
            paidAt: new Date(),
            itemPrice: parseFloat(itemPrice.toFixed(2)),
            taxPrice: parseFloat(taxPrice.toFixed(2)),
            shippingPrice: parseFloat(shippingPrice.toFixed(2)),
            totalPrice: parseFloat(totalPrice.toFixed(2)),
            orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
            deliveredAt: i % 3 === 0 ? new Date() : undefined
        });
    }

    await Order.insertMany(ordersToCreate);
    console.log("Created 30 orders.");

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
