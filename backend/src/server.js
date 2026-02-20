const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            process.env.ADMIN_URL || 'http://localhost:3001',
        ],
        methods: ['GET', 'POST'],
    },
});
app.set('io', io);
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    socket.on('joinOrder', (orderId) => socket.join(`order-${orderId}`));
    socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ═══════════════════════════════════════════════════════════
// MONGOOSE SCHEMAS (xotirada MongoDB)
// ═══════════════════════════════════════════════════════════

const localizedText = { uz: String, ru: String, en: String };

const ProductSchema = new mongoose.Schema({
    name: localizedText,
    description: localizedText,
    price: { type: Number, required: true },
    category: { type: String, enum: ['cakes', 'pastries', 'cookies', 'bread', 'drinks', 'special'], required: true },
    imageUrl: String,
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, unique: true },
    firstName: String,
    lastName: String,
    phone: String,
    language: { type: String, default: 'uz' },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
    userId: { type: String },
    items: [{
        productId: { type: String },
        quantity: Number,
        price: Number,
    }],
    totalPrice: Number,
    status: { type: String, enum: ['pending', 'paid', 'preparing', 'delivering', 'delivered', 'cancelled'], default: 'pending' },
    paymentType: { type: String, enum: ['cash', 'click', 'payme'], default: 'cash' },
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    location: { lat: Number, lng: Number },
    qrCode: String,
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
    }],
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
    orderId: { type: String },
    type: { type: String, enum: ['cash', 'click', 'payme'] },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paidAt: Date,
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const Admin = mongoose.model('Admin', AdminSchema);

// ═══════════════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════════════

const JWT_SECRET = process.env.JWT_SECRET || 'bakery-super-secret-jwt-key-2024';

const adminAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        req.admin = jwt.verify(token, JWT_SECRET);
        next();
    } catch { return res.status(401).json({ error: 'Invalid token' }); }
};

// ═══════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════

app.post('/api/auth/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, admin: { email: admin.email, role: admin.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/telegram/verify', async (req, res) => {
    try {
        const { user } = req.body;
        if (!user) return res.status(400).json({ error: 'User data required' });
        let existing = await User.findOne({ telegramId: String(user.id) });
        if (!existing) {
            existing = await User.create({
                telegramId: String(user.id),
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                language: user.language_code || 'uz',
            });
        }
        res.json({ user: existing });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════
// PRODUCTS ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/products', async (req, res) => {
    try {
        let filter = {};
        if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
        if (req.query.search) {
            const s = req.query.search;
            filter.$or = [
                { 'name.uz': { $regex: s, $options: 'i' } },
                { 'name.ru': { $regex: s, $options: 'i' } },
                { 'name.en': { $regex: s, $options: 'i' } },
            ];
        }
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', adminAuth, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════
// CART ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/cart/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) cart = { userId: req.params.userId, items: [] };
        res.json(cart);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/cart/add', async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });
        const existingItem = cart.items.find(i => i.productId.toString() === productId);
        if (existingItem) existingItem.quantity += quantity;
        else cart.items.push({ productId, quantity });
        await cart.save();
        res.json(cart);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/cart/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ userId, items: [] });
        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/cart/:userId', async (req, res) => {
    try {
        await Cart.findOneAndUpdate({ userId: req.params.userId }, { items: [] });
        res.json({ message: 'Cart cleared' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════
// ORDERS ROUTES
// ═══════════════════════════════════════════════════════════

app.post('/api/orders', async (req, res) => {
    try {
        const { userId, items, firstName, lastName, phone, address, location, paymentType, totalPrice: clientTotal } = req.body;

        // Calculate total from actual product prices
        let totalPrice = 0;
        const orderItems = [];
        for (const item of items) {
            let price = item.price || 0;
            try {
                if (mongoose.isValidObjectId(item.productId)) {
                    const product = await Product.findById(item.productId);
                    if (product) price = product.price;
                }
            } catch { }
            totalPrice += price * item.quantity;
            orderItems.push({ productId: item.productId, quantity: item.quantity, price });
        }

        // Use client total if server calculation is 0
        if (totalPrice === 0 && clientTotal) totalPrice = clientTotal;

        let qrCode = '';
        try { qrCode = await QRCode.toDataURL(`ORDER-${Date.now()}`); } catch { }

        const order = await Order.create({
            userId: userId || undefined,
            items: orderItems, totalPrice,
            paymentType: paymentType || 'cash',
            status: paymentType === 'click' ? 'paid' : 'pending',
            firstName, lastName, phone, address, location, qrCode,
        });

        await Payment.create({
            orderId: order._id.toString(),
            type: paymentType || 'cash',
            status: paymentType === 'click' ? 'paid' : 'pending',
        });

        console.log(`✅ Yangi buyurtma: #${order._id} — ${firstName} ${lastName} — ${totalPrice} so'm`);
        io.emit('newOrder', order);
        res.status(201).json(order);
    } catch (err) {
        console.error('Order error:', err);
        res.status(500).json({ error: err.message || 'Failed to create order' });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        let filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.userId) filter.userId = req.query.userId;
        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json({ orders, total: orders.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders/user/:telegramId', async (req, res) => {
    try {
        const user = await User.findOne({ telegramId: req.params.telegramId });
        if (!user) return res.json([]);
        const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (req.body.status === 'paid' || req.body.status === 'delivered') {
            await Payment.findOneAndUpdate({ orderId: order._id }, { status: 'paid', paidAt: new Date() });
        }
        io.emit('orderUpdate', order);
        res.json(order);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════
// USERS ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/users', adminAuth, async (req, res) => {
    try {
        let filter = {};
        if (req.query.search) {
            const s = req.query.search;
            filter.$or = [
                { firstName: { $regex: s, $options: 'i' } },
                { lastName: { $regex: s, $options: 'i' } },
                { phone: { $regex: s, $options: 'i' } },
            ];
        }
        const users = await User.find(filter).sort({ createdAt: -1 });
        res.json({ users, total: users.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const orders = await Order.find({ userId: user._id });
        res.json({ ...user.toObject(), orders });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════
// PAYMENTS ROUTES
// ═══════════════════════════════════════════════════════════

app.post('/api/payments/click/callback', async (req, res) => {
    try {
        const { orderId } = req.body;
        await Order.findByIdAndUpdate(orderId, { status: 'paid' });
        await Payment.findOneAndUpdate({ orderId }, { status: 'paid', paidAt: new Date() });
        res.json({ status: 'ok' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════
// DASHBOARD ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/dashboard/stats', adminAuth, async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalProducts] = await Promise.all([
            User.countDocuments(), Order.countDocuments(), Product.countDocuments(),
        ]);
        const revenueAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
        const totalRevenue = revenueAgg[0]?.total || 0;
        const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        const paymentBreakdown = await Order.aggregate([
            { $group: { _id: '$paymentType', count: { $sum: 1 }, total: { $sum: '$totalPrice' } } },
        ]);
        res.json({ totalUsers, totalOrders, totalProducts, totalRevenue, ordersByStatus, paymentBreakdown });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
    const [products, users, orders] = await Promise.all([
        Product.countDocuments(), User.countDocuments(), Order.countDocuments(),
    ]);
    res.json({
        status: 'ok', mode: 'mongodb-memory-server',
        timestamp: new Date().toISOString(), uptime: process.uptime(),
        data: { products, users, orders },
    });
});

// ─── 404 & Error ────────────────────────────────────────────
app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => { console.error('Error:', err.message); res.status(500).json({ error: 'Internal server error' }); });

// ═══════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════

const seedData = async () => {
    const count = await Product.countDocuments();
    if (count > 0) return; // already seeded

    console.log('🌱 Seeding database...');

    // Admin
    const passwordHash = await bcrypt.hash('admin123', 10);
    await Admin.create({ email: 'admin@bakery.uz', passwordHash, role: 'superadmin' });
    console.log('👑 Admin: admin@bakery.uz / admin123');

    // Products
    const products = [
        { name: { uz: "Shokoladli tort", ru: "Шоколадный торт", en: "Chocolate Cake" }, description: { uz: "Yumshoq shokoladli biskvit, qatlamli krem bilan", ru: "Нежный шоколадный бисквит со слоями крема", en: "Soft chocolate sponge with layers of cream" }, price: 120000, category: "cakes", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", isAvailable: true },
        { name: { uz: "Qulupnayli tort", ru: "Клубничный торт", en: "Strawberry Cake" }, description: { uz: "Yangi qulupnaylar va vanil kremi bilan", ru: "Со свежей клубникой и ванильным кремом", en: "With fresh strawberries and vanilla cream" }, price: 150000, category: "cakes", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500", isAvailable: true },
        { name: { uz: "Kruassan", ru: "Круассан", en: "Croissant" }, description: { uz: "Fransuz uslubidagi oltin kruassan", ru: "Золотистый круассан по-французски", en: "Golden French-style croissant" }, price: 25000, category: "pastries", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=500", isAvailable: true },
        { name: { uz: "Makaron", ru: "Макарон", en: "Macaron" }, description: { uz: "Rangli va mazali fransuz makaronlari", ru: "Разноцветные и вкусные французские макароны", en: "Colorful and delicious French macarons" }, price: 15000, category: "cookies", imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500", isAvailable: true },
        { name: { uz: "Tiramisu", ru: "Тирамису", en: "Tiramisu" }, description: { uz: "Klassik italyan tiramisu desserti", ru: "Классический итальянский десерт тирамису", en: "Classic Italian tiramisu dessert" }, price: 80000, category: "special", imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500", isAvailable: true },
        { name: { uz: "Non", ru: "Лепёшка", en: "Tandoori Bread" }, description: { uz: "An'anaviy o'zbek tandirda pishirilgan non", ru: "Традиционный узбекский хлеб из тандыра", en: "Traditional Uzbek bread baked in tandoor" }, price: 8000, category: "bread", imageUrl: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=500", isAvailable: true },
        { name: { uz: "Latté", ru: "Латте", en: "Latte" }, description: { uz: "Yumshoq sutli kofe – latte", ru: "Нежный молочный кофе — латте", en: "Smooth milky coffee – latte" }, price: 30000, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500", isAvailable: true },
        { name: { uz: "Eklér", ru: "Эклер", en: "Eclair" }, description: { uz: "Shokoladli glazurli klassik fransuz ekléri", ru: "Классический французский эклер с шоколадной глазурью", en: "Classic French eclair with chocolate glaze" }, price: 20000, category: "pastries", imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500", isAvailable: true },
        { name: { uz: "Red Velvet tort", ru: "Торт Ред Вельвет", en: "Red Velvet Cake" }, description: { uz: "Qizil baxmal tort krem-syr bilan", ru: "Торт красный бархат с кремом из сливочного сыра", en: "Red velvet cake with cream cheese frosting" }, price: 180000, category: "cakes", imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500", isAvailable: true },
        { name: { uz: "Cheesecake", ru: "Чизкейк", en: "Cheesecake" }, description: { uz: "Nyu-York uslubidagi klassik cheesecake", ru: "Классический чизкейк в нью-йоркском стиле", en: "Classic New York style cheesecake" }, price: 95000, category: "special", imageUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500", isAvailable: true },
        { name: { uz: "Shokoladli keks", ru: "Шоколадный кекс", en: "Chocolate Muffin" }, description: { uz: "Yumshoq va mazali shokoladli keks", ru: "Мягкий и вкусный шоколадный кекс", en: "Soft and delicious chocolate muffin" }, price: 18000, category: "cookies", imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500", isAvailable: true },
        { name: { uz: "Kapuchino", ru: "Капучино", en: "Cappuccino" }, description: { uz: "Italyan kapuchino – ko'pikli kofe", ru: "Итальянский капучино — кофе с пенкой", en: "Italian cappuccino – foamy coffee" }, price: 28000, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500", isAvailable: true },
    ];
    await Product.insertMany(products);
    console.log(`🍪 ${products.length} products loaded`);

    // Test user
    await User.create({ telegramId: '123456789', firstName: 'Test', lastName: 'User', phone: '+998901234567', language: 'uz' });
    console.log('👤 Test user created');
};

// ═══════════════════════════════════════════════════════════
// START SERVER WITH MongoDB Memory Server
// ═══════════════════════════════════════════════════════════

process.env.MONGOMS_DOWNLOAD_DIR = '/tmp/.mongo-binaries';
const { MongoMemoryServer } = require('mongodb-memory-server');
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        console.log('\n⏳ MongoDB Memory Server ishga tushirilmoqda...');
        const tmpDir = path.join(__dirname, '..', '.mongo-data');
        const mongod = await MongoMemoryServer.create({
            instance: { dbPath: tmpDir, storageEngine: 'ephemeralForTest' },
        });
        const uri = mongod.getUri();
        console.log(`📦 MongoDB Memory Server tayyor: ${uri}`);

        await mongoose.connect(uri);
        console.log('✅ Mongoose ulandi!');

        await seedData();

        server.listen(PORT, () => {
            console.log(`\n🍰 Bakery API Server: http://localhost:${PORT}`);
            console.log(`📡 Mode: MongoDB Memory Server (xotirada)`)
            console.log(`👑 Admin: admin@bakery.uz / admin123`);
            console.log(`🌐 Health: http://localhost:${PORT}/api/health\n`);
        });
    } catch (err) {
        console.error('❌ Server start error:', err);
        process.exit(1);
    }
};

startServer();

module.exports = { app, server };
