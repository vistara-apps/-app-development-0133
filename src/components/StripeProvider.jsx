import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../services/stripeService';

export function StripeProvider({ children }) {
  const stripePromise = getStripe();
  
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

