const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Dashboard stats (admin)
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Revenue calculations
        const revenueAgg = await Order.aggregate([
            { $match: { status: { $in: ['paid', 'preparing', 'delivering', 'delivered'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Payment type breakdown
        const paymentBreakdown = await Order.aggregate([
            { $group: { _id: '$paymentType', count: { $sum: 1 }, total: { $sum: '$totalPrice' } } }
        ]);

        // Daily orders (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dailyOrders = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .populate('userId')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
            ordersByStatus,
            paymentBreakdown,
            dailyOrders,
            recentOrders,
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
