import * as React from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY)

export const Checkout = () => {
  return (
    <div>
        <h1>Dilo</h1>
        <button rel="link">Checkout</button>
    </div>
  )
}
