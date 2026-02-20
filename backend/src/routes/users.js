const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all users (admin)
router.get('/', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await User.countDocuments(filter);

        res.json({
            users,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single user with order history
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const orders = await Order.find({ userId: user._id })
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.json({ user, orders });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
