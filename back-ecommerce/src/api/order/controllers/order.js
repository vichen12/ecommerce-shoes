'use strict';

module.exports = {
    async create(ctx) {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { products } = ctx.request.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.attributes.productName,
                },
                unit_amount: Math.round(product.attributes.price * 100),
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
        });

        return { stripeSession: session };
    },
};
