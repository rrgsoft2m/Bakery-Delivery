const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const User = require('./models/User');

const seedProducts = [
    {
        name: { uz: "Shokoladli tort", ru: "Шоколадный торт", en: "Chocolate Cake" },
        description: {
            uz: "Yumshoq shokoladli biskvit, qatlamli krem bilan",
            ru: "Нежный шоколадный бисквит со слоями крема",
            en: "Soft chocolate sponge with layers of cream"
        },
        price: 120000,
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Qulupnayli tort", ru: "Клубничный торт", en: "Strawberry Cake" },
        description: {
            uz: "Yangi qulupnaylar va vanil kremi bilan",
            ru: "Со свежей клубникой и ванильным кремом",
            en: "With fresh strawberries and vanilla cream"
        },
        price: 150000,
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Kruassan", ru: "Круассан", en: "Croissant" },
        description: {
            uz: "Fransuz uslubidagi oltin kruassan",
            ru: "Золотистый круассан по-французски",
            en: "Golden French-style croissant"
        },
        price: 25000,
        category: "pastries",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Makaron", ru: "Макарон", en: "Macaron" },
        description: {
            uz: "Rangli va mazali fransuz makaronlari",
            ru: "Разноцветные и вкусные французские макароны",
            en: "Colorful and delicious French macarons"
        },
        price: 15000,
        category: "cookies",
        imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Tiramisu", ru: "Тирамису", en: "Tiramisu" },
        description: {
            uz: "Klassik italyan tiramisu desserti",
            ru: "Классический итальянский десерт тирамису",
            en: "Classic Italian tiramisu dessert"
        },
        price: 80000,
        category: "special",
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Non", ru: "Лепёшка", en: "Tandoori Bread" },
        description: {
            uz: "An'anaviy o'zbek tandirda pishirilgan non",
            ru: "Традиционный узбекский хлеб из тандыра",
            en: "Traditional Uzbek bread baked in tandoor"
        },
        price: 8000,
        category: "bread",
        imageUrl: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Latté", ru: "Латте", en: "Latte" },
        description: {
            uz: "Yumshoq sutli kofe – latte",
            ru: "Нежный молочный кофе — латте",
            en: "Smooth milky coffee – latte"
        },
        price: 30000,
        category: "drinks",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Eklér", ru: "Эклер", en: "Eclair" },
        description: {
            uz: "Shokoladli glazurli klassik fransuz ekléri",
            ru: "Классический французский эклер с шоколадной глазурью",
            en: "Classic French eclair with chocolate glaze"
        },
        price: 20000,
        category: "pastries",
        imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Red Velvet tort", ru: "Торт Ред Вельвет", en: "Red Velvet Cake" },
        description: {
            uz: "Qizil baxmal tort krem-syr bilan",
            ru: "Торт красный бархат с кремом из сливочного сыра",
            en: "Red velvet cake with cream cheese frosting"
        },
        price: 180000,
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Cheesecake", ru: "Чизкейк", en: "Cheesecake" },
        description: {
            uz: "Nyu-York uslubidagi klassik cheesecake",
            ru: "Классический чизкейк в нью-йоркском стиле",
            en: "Classic New York style cheesecake"
        },
        price: 95000,
        category: "special",
        imageUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Shokoladli keks", ru: "Шоколадный кекс", en: "Chocolate Muffin" },
        description: {
            uz: "Yumshoq va mazali shokoladli keks",
            ru: "Мягкий и вкусный шоколадный кекс",
            en: "Soft and delicious chocolate muffin"
        },
        price: 18000,
        category: "cookies",
        imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500",
        isAvailable: true,
    },
    {
        name: { uz: "Kapuchino", ru: "Капучино", en: "Cappuccino" },
        description: {
            uz: "Italyan kapuchino – ko'pikli kofe",
            ru: "Итальянский капучино — кофе с пенкой",
            en: "Italian cappuccino – foamy coffee"
        },
        price: 28000,
        category: "drinks",
        imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500",
        isAvailable: true,
    },
];

const seed = async () => {
    try {
        await connectDB();
        console.log('🌱 Seeding database...\n');

        // Clear existing data
        await Admin.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin
        const passwordHash = await Admin.hashPassword('admin123');
        await Admin.create({
            email: 'admin@bakery.uz',
            passwordHash,
            role: 'superadmin',
        });
        console.log('👑 Admin created: admin@bakery.uz / admin123');

        // Create products
        await Product.insertMany(seedProducts);
        console.log(`🍰 ${seedProducts.length} products created`);

        // Create test user
        await User.deleteMany({});
        await User.create({
            telegramId: '123456789',
            firstName: 'Test',
            lastName: 'User',
            phone: '+998901234567',
            language: 'uz',
        });
        console.log('👤 Test user created');

        console.log('\n✅ Seeding complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seed();
