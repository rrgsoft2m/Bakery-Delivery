const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentType: {
        type: String,
        enum: ['cash', 'click'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'preparing', 'delivering', 'delivered', 'cancelled'],
        default: 'pending',
    },
    firstName: String,
    lastName: String,
    phone: String,
    address: {
        type: String,
        required: true,
    },
    location: {
        lat: Number,
        lng: Number,
    },
    qrCode: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);
