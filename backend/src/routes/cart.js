const express = require('express');
const Cart = require('../models/Cart');
const { validate, cartAddSchema, cartRemoveSchema } = require('../middleware/validate');

const router = express.Router();

// Get user cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId })
            .populate('items.productId');
        if (!cart) {
            cart = { items: [] };
        }
        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to cart
router.post('/add', validate(cartAddSchema), async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.productId');
        res.json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from cart
router.post('/remove', validate(cartRemoveSchema), async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json(updatedCart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update quantity
router.post('/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const item = cart.items.find(
            i => i.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ error: 'Item not in cart' });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                i => i.productId.toString() !== productId
            );
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json(updatedCart);
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
