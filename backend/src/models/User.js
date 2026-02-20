const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        unique: true,
        sparse: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        enum: ['uz', 'ru', 'en'],
        default: 'uz',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
