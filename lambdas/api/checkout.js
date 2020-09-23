const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createSession = () => {
  return stripe.checkout.session.create({
      payment_method_types: ['card'],
      line_items: [
          {
              price: process.env.STRIPE_MONTHLY_PRODUCT_ID,
              quantity: 1,
          }
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
  });
};

exports.createSession = createSession;
