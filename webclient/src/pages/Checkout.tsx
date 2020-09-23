import * as React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EventContext } from '../context/eventContext'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY)

export const Checkout = () => {
  const events = React.useContext(EventContext)
  const [stripe, setStripe] = React.useState();
  const checkoutSessionCreatedListener: EventListener = {
    eventType: 'CHECKOUT_SESSION_CREATED',
    callback: async ({ data: session }: MessageEvent) => {
      if (!stripe) {
          alert('Stripe is not ready. Try again');
          return;
      }

      const result = await stripe.redirectToCheckout(session);
      if (result.error) {
          alert(result.error.message);
      }
    },
  }
  React.useEffect(() => {
    events.addEventListener(checkoutSessionCreatedListener);
    return () => {
      events.removeEventListener(checkoutSessionCreatedListener);
    }
  });


  const onClick = async () => {
    setStripe(await stripePromise)
    events.send('CHECKOUT_SESSION_REQUESTED', message)
  }

  return (
    <div>
        <h1>Dilo</h1>
        <button rel="link" onClick={onClick}>Checkout</button>
    </div>
  )
}
