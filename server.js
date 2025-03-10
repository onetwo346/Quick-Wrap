const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51O...'); // Replace with your Stripe secret key
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve the HTML file

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: req.body.priceId, // Replace with your Stripe Price ID
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/?premium=true`,
            cancel_url: `${req.headers.origin}/`,
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
