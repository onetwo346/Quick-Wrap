const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_YOUR_SECRET_KEY');
const app = express();
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Quick Wrap Premium' },
        unit_amount: 500,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://yourdomain.com?success=true',
    cancel_url: 'https://yourdomain.com',
  });
  res.json({ sessionId: session.id });
});

app.listen(process.env.PORT || 3000);
