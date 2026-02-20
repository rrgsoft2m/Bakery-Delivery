const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        uz: { type: String, required: true },
        ru: { type: String, required: true },
        en: { type: String, required: true },
    },
    description: {
        uz: { type: String, required: true },
        ru: { type: String, required: true },
        en: { type: String, required: true },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ['cakes', 'pastries', 'bread', 'cookies', 'drinks', 'special'],
    },
    imageUrl: {
        type: String,
        default: '',
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
