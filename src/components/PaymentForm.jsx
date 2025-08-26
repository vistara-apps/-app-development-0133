import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './Button';
import { LoadingIndicator } from './LoadingIndicator';

export function PaymentForm({ onSuccess, onError, amount, description }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would create a payment intent on your server
      // and return the client secret to use here
      
      // For demo purposes, we're just simulating a successful payment
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          id: 'pi_' + Math.random().toString(36).substring(2, 15),
          amount: amount,
          status: 'succeeded'
        });
      }, 2000);
      
      // Real implementation would look like this:
      /*
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });
      
      if (error) {
        throw error;
      }
      
      // Send paymentMethod.id to your server for processing
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          amount: amount,
        }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      onSuccess(result);
      */
      
    } catch (err) {
      setError(err.message || 'An error occurred while processing your payment.');
      onError(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md bg-surface">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-lg font-bold">${(amount / 100).toFixed(2)}</p>
        </div>
        
        <Button 
          type="submit" 
          disabled={!stripe || loading}
        >
          {loading ? <LoadingIndicator size="sm" /> : 'Pay Now'}
        </Button>
      </div>
    </form>
  );
}

