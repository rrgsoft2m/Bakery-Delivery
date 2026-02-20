const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

adminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

adminSchema.statics.hashPassword = async function (password) {
    return bcrypt.hash(password, 12);
};

module.exports = mongoose.model('Admin', adminSchema);
