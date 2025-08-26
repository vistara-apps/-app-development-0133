import React, { useState } from 'react';
import { Modal } from './Modal';
import { PaymentForm } from './PaymentForm';
import { Button } from './Button';
import { Check } from 'lucide-react';

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  title = 'Complete Your Purchase',
  description = 'Enter your payment details to complete your purchase',
  amount = 1000, // in cents
  productName = 'Premium Subscription',
  onPaymentSuccess,
  onPaymentError
}) {
  const [paymentStatus, setPaymentStatus] = useState('initial'); // initial, processing, success, error
  const [paymentError, setPaymentError] = useState(null);
  
  const handlePaymentSuccess = (paymentResult) => {
    setPaymentStatus('success');
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentResult);
    }
  };
  
  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    setPaymentError(error.message || 'Payment failed');
    if (onPaymentError) {
      onPaymentError(error);
    }
  };
  
  const handleClose = () => {
    // Reset state when modal is closed
    setPaymentStatus('initial');
    setPaymentError(null);
    onClose();
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={paymentStatus === 'success' ? 'Payment Successful' : title}
    >
      {paymentStatus === 'success' ? (
        <div className="text-center py-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Thank You For Your Purchase</h3>
          <p className="text-text-secondary mb-6">
            Your payment has been processed successfully.
          </p>
          
          <Button onClick={handleClose}>
            Close
          </Button>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-6">{description}</p>
          
          <div className="mb-6 p-4 bg-surface rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">Product</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount</span>
              <span className="font-medium">${(amount / 100).toFixed(2)}</span>
            </div>
          </div>
          
          <PaymentForm 
            amount={amount}
            description={productName}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </>
      )}
    </Modal>
  );
}

