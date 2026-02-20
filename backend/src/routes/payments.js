const express = require('express');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const router = express.Router();

// Click payment callback (simulation)
router.post('/click/callback', async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update payment status
        await Payment.findOneAndUpdate(
            { orderId },
            { status: 'paid', paidAt: new Date() }
        );

        // Update order status
        order.status = 'paid';
        await order.save();

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('paymentReceived', { orderId, status: 'paid' });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error('Click callback error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
