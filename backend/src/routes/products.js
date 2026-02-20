const express = require('express');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');
const { validate, productSchema } = require('../middleware/validate');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const { category, search, available } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (available !== undefined) filter.isAvailable = available === 'true';
        if (search) {
            filter.$or = [
                { 'name.uz': { $regex: search, $options: 'i' } },
                { 'name.ru': { $regex: search, $options: 'i' } },
                { 'name.en': { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product (admin only)
router.post('/', adminAuth, validate(productSchema), async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
