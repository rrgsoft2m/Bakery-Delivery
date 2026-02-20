const express = require('express');
const QRCode = require('qrcode');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const adminAuth = require('../middleware/adminAuth');
const { validate, orderSchema, orderStatusSchema } = require('../middleware/validate');

const router = express.Router();

// Create order
router.post('/', validate(orderSchema), async (req, res) => {
    try {
        const order = new Order(req.body);

        // Generate QR code
        const qrData = JSON.stringify({
            orderId: order._id,
            total: order.totalPrice,
            status: order.status,
        });
        order.qrCode = await QRCode.toDataURL(qrData);

        await order.save();

        // Create payment record
        await Payment.create({
            orderId: order._id,
            type: order.paymentType,
            status: order.paymentType === 'click' ? 'paid' : this.status || 'pending',
            paidAt: order.paymentType === 'click' ? new Date() : null,
        });

        // If click payment, mark as paid
        if (order.paymentType === 'click') {
            order.status = 'paid';
            await order.save();
        }

        // Clear user cart
        await Cart.findOneAndDelete({ userId: order.userId });

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.emit('newOrder', order);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all orders (admin)
router.get('/', adminAuth, async (req, res) => {
    try {
        const { status, paymentType, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (paymentType) filter.paymentType = paymentType;

        const orders = await Order.find(filter)
            .populate('userId')
            .populate('items.productId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Order.countDocuments(filter);

        res.json({
            orders,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('items.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId')
            .populate('items.productId');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status (admin)
router.put('/:id/status', adminAuth, validate(orderStatusSchema), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate('userId').populate('items.productId');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update payment if marking as paid
        if (req.body.status === 'paid') {
            await Payment.findOneAndUpdate(
                { orderId: order._id },
                { status: 'paid', paidAt: new Date() }
            );
        }

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('orderStatusUpdate', { orderId: order._id, status: order.status });
        }

        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
