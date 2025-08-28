import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Card } from './Card';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/authStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  Wallet, 
  Check, 
  AlertCircle, 
  Loader,
  Lock,
  Zap
} from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
};

function StripePaymentForm({ plan, onSuccess, onError, processing }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();
  const { processSubscriptionPayment } = usePaymentStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardError, setCardError] = useState(null);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || isSubmitting) return;
    
    setIsSubmitting(true);
    setCardError(null);
    
    const cardElement = elements.getElement(CardElement);
    
    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: user?.email || 'demo@example.com',
          name: user?.name || 'Demo User'
        },
      });
      
      if (error) {
        setCardError(error.message);
        setIsSubmitting(false);
        return;
      }
      
      // Process subscription
      const result = await processSubscriptionPayment(
        'stripe',
        plan.id,
        user?.userId || 'demo-user-1',
        { paymentMethodId: paymentMethod.id }
      );
      
      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error || 'Payment failed');
      }
    } catch (err) {
      setCardError(err.message || 'Payment failed');
      onError(err.message || 'Payment failed');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 rounded-md bg-white">
            <CardElement 
              options={cardElementOptions}
              onChange={(event) => {
                setCardError(event.error ? event.error.message : null);
              }}
            />
          </div>
          {cardError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {cardError}
            </div>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Lock className="w-4 h-4 mr-2" />
          Your payment information is secured by Stripe
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={!stripe || isSubmitting || processing}
      >
        {isSubmitting || processing ? (
          <div className="flex items-center justify-center">
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </div>
        ) : (
          `Subscribe to ${plan.name} - $${plan.price}/${plan.interval}`
        )}
      </Button>
    </form>
  );
}

function BaseX402PaymentForm({ plan, onSuccess, onError, processing }) {
  const { user } = useAuthStore();
  const { processSubscriptionPayment } = usePaymentStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  
  useEffect(() => {
    checkWalletConnection();
  }, []);
  
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };
  
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      onError('MetaMask or compatible wallet not found');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
    } catch (error) {
      onError('Failed to connect wallet');
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!walletConnected || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await processSubscriptionPayment(
        'base-x402',
        plan.id,
        user?.userId || 'demo-user-1'
      );
      
      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error || 'X402 payment failed');
      }
    } catch (error) {
      onError(error.message || 'X402 payment failed');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-6">
      {!walletConnected ? (
        <div className="text-center space-y-4">
          <div className="p-8 bg-blue-50 rounded-lg">
            <Wallet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your Web3 wallet to pay with cryptocurrency on Base network
            </p>
            <Button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700">
              Connect Wallet
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="font-medium text-green-900">Wallet Connected</div>
                  <div className="text-sm text-green-700">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">Base Network Payment</div>
                  <div className="text-blue-700 space-y-1">
                    <div>Amount: {plan.basePrice} ETH</div>
                    <div>Network: Base Sepolia (Testnet)</div>
                    <div>Low transaction fees</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Payment processed securely on Base blockchain
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting || processing}
          >
            {isSubmitting || processing ? (
              <div className="flex items-center justify-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              `Pay ${plan.basePrice} ETH for ${plan.name}`
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export function PaymentModal() {
  const {
    isPaymentModalOpen,
    selectedPlan,
    isProcessingPayment,
    paymentError,
    hidePaymentModal,
    clearPaymentError,
    initializePayments,
    getAvailablePaymentMethods
  } = usePaymentStore();
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  
  const availablePaymentMethods = getAvailablePaymentMethods();
  
  useEffect(() => {
    if (isPaymentModalOpen) {
      initializePayments();
      setPaymentSuccess(false);
      setSuccessResult(null);
      clearPaymentError();
    }
  }, [isPaymentModalOpen]);
  
  const handlePaymentSuccess = (result) => {
    setPaymentSuccess(true);
    setSuccessResult(result);
    clearPaymentError();
  };
  
  const handlePaymentError = (error) => {
    // Error is handled by the payment store
    console.error('Payment error:', error);
  };
  
  const handleClose = () => {
    hidePaymentModal();
    setPaymentMethod('stripe');
    setPaymentSuccess(false);
    setSuccessResult(null);
  };
  
  if (!isPaymentModalOpen || !selectedPlan) {
    return null;
  }
  
  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={handleClose}
      title={paymentSuccess ? 'Payment Successful!' : `Subscribe to ${selectedPlan.name}`}
      className="max-w-2xl"
    >
      {paymentSuccess ? (
        <div className="text-center space-y-6">
          <div className="p-8 bg-green-50 rounded-lg">
            <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              Welcome to {selectedPlan.name}!
            </h3>
            <p className="text-green-700">
              Your subscription is now active. You have access to all {selectedPlan.name} features.
            </p>
            {successResult && (
              <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg text-left">
                <div className="text-sm text-gray-600">
                  <div>Transaction ID: {successResult.subscriptionId || successResult.transactionHash}</div>
                  <div>Amount: ${successResult.amount}</div>
                </div>
              </div>
            )}
          </div>
          <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
            Continue to App
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan Summary */}
          <Card className="p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedPlan.name}</h3>
                <p className="text-gray-600">{selectedPlan.features.length} features included</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${selectedPlan.price}
                </div>
                <div className="text-sm text-gray-600">per {selectedPlan.interval}</div>
              </div>
            </div>
          </Card>
          
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Choose Payment Method</h4>
            <div className="grid grid-cols-1 gap-3">
              {availablePaymentMethods.map((method) => (
                <label key={method.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <Card className={`p-4 transition-colors ${
                    paymentMethod === method.id 
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{method.fees}</div>
                    </div>
                  </Card>
                </label>
              ))}
            </div>
          </div>
          
          {/* Payment Error */}
          {paymentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}
          
          {/* Payment Forms */}
          <div className="border-t pt-6">
            {paymentMethod === 'stripe' && (
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  plan={selectedPlan}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  processing={isProcessingPayment}
                />
              </Elements>
            )}
            
            {paymentMethod === 'base-x402' && (
              <BaseX402PaymentForm
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                processing={isProcessingPayment}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}