const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { validate, adminLoginSchema } = require('../middleware/validate');
const { telegramAuth } = require('../middleware/telegramAuth');

const router = express.Router();

// Admin Login
router.post('/admin/login', validate(adminLoginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
            token,
            admin: { id: admin._id, email: admin.email, role: admin.role },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Telegram Verify — creates or finds user
router.post('/telegram/verify', telegramAuth, async (req, res) => {
    try {
        res.json({
            user: req.user,
            telegramUser: req.telegramUser,
        });
    } catch (error) {
        console.error('Telegram verify error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
