const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const errors = error.errors?.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        res.status(400).json({ error: 'Validation failed', details: errors });
    }
};

// Schemas
const adminLoginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const productSchema = z.object({
    name: z.object({
        uz: z.string().min(1),
        ru: z.string().min(1),
        en: z.string().min(1),
    }),
    description: z.object({
        uz: z.string().min(1),
        ru: z.string().min(1),
        en: z.string().min(1),
    }),
    price: z.number().min(0),
    category: z.enum(['cakes', 'pastries', 'bread', 'cookies', 'drinks', 'special']),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().optional(),
});

const cartAddSchema = z.object({
    userId: z.string().min(1),
    productId: z.string().min(1),
    quantity: z.number().int().min(1).optional(),
});

const cartRemoveSchema = z.object({
    userId: z.string().min(1),
    productId: z.string().min(1),
});

const orderSchema = z.object({
    userId: z.string().min(1),
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
        price: z.number().min(0),
    })).min(1),
    totalPrice: z.number().min(0),
    paymentType: z.enum(['cash', 'click']),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().min(1),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
});

const orderStatusSchema = z.object({
    status: z.enum(['pending', 'paid', 'preparing', 'delivering', 'delivered', 'cancelled']),
});

module.exports = {
    validate,
    adminLoginSchema,
    productSchema,
    cartAddSchema,
    cartRemoveSchema,
    orderSchema,
    orderStatusSchema,
};
