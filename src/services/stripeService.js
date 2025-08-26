import { loadStripe } from '@stripe/stripe-js';
import { 
  createCheckoutSession as apiCreateCheckoutSession,
  createCustomerPortalSession as apiCreateCustomerPortalSession,
  getSubscriptionStatus
} from './apiService';

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key';

// Initialize Stripe
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Create a checkout session for subscription
export const createCheckoutSession = async (priceId, customerId) => {
  try {
    // Call the API service to create a checkout session
    return await apiCreateCheckoutSession(priceId);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create a customer portal session for managing subscription
export const createCustomerPortalSession = async (customerId) => {
  try {
    // Call the API service to create a customer portal session
    return await apiCreateCustomerPortalSession();
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

// Check subscription status
export const checkSubscriptionStatus = async (customerId) => {
  try {
    // Call the API service to get subscription status
    return await getSubscriptionStatus();
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw error;
  }
};
