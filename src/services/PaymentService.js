/**
 * Payment Service for Base X402 and Stripe Integration
 * 
 * This service handles both Base blockchain X402 payments and traditional Stripe payments
 * for subscription management and premium features in ResilientFlow.
 */

import axios from 'axios';

// Base X402 Payment Configuration
const BASE_X402_CONFIG = {
  // Base Sepolia testnet configuration (for testing)
  chainId: 84532,
  rpcUrl: 'https://sepolia.base.org',
  contractAddress: import.meta.env.VITE_BASE_PAYMENT_CONTRACT || '0x0000000000000000000000000000000000000000',
  apiKey: import.meta.env.VITE_BASE_API_KEY || 'demo-key'
};

// Stripe Configuration
const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    interval: 'month',
    features: [
      'Daily emotional check-ins',
      'Basic activities library',
      'Weekly insights',
      '1 support circle'
    ],
    basePrice: '0.001', // Base ETH equivalent
    stripePriceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_demo_basic'
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 19.99,
    interval: 'month',
    features: [
      'All Basic features',
      'AI-powered contextual nudges',
      'Advanced analytics',
      'Unlimited support circles',
      'Custom activity builder',
      'Priority support'
    ],
    basePrice: '0.002', // Base ETH equivalent
    stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_demo_premium'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 49.99,
    interval: 'month',
    features: [
      'All Premium features',
      'Team management',
      'Advanced integrations',
      'Custom branding',
      'Dedicated support',
      'API access'
    ],
    basePrice: '0.005', // Base ETH equivalent
    stripePriceId: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || 'price_demo_enterprise'
  }
};

/**
 * Base X402 Payment Implementation
 */
export class BaseX402Payment {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  /**
   * Initialize Web3 connection
   */
  async initialize() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask or compatible wallet not found');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      this.account = accounts[0];

      // Switch to Base Sepolia testnet if needed
      await this.switchToBaseNetwork();

      return true;
    } catch (error) {
      console.error('Failed to initialize Base X402 payment:', error);
      throw error;
    }
  }

  /**
   * Switch to Base network
   */
  async switchToBaseNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_X402_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BASE_X402_CONFIG.chainId.toString(16)}`,
                chainName: 'Base Sepolia',
                rpcUrls: [BASE_X402_CONFIG.rpcUrl],
                blockExplorerUrls: ['https://sepolia-explorer.base.org'],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Base network to wallet');
        }
      } else {
        throw new Error('Failed to switch to Base network');
      }
    }
  }

  /**
   * Create X402 payment for subscription
   */
  async createX402Payment(planId, userId) {
    if (!this.account) {
      await this.initialize();
    }

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    try {
      // Convert ETH amount to Wei
      const amountInWei = window.ethereum.utils?.toWei(plan.basePrice, 'ether') || 
        (parseFloat(plan.basePrice) * 1e18).toString();

      // Create payment transaction
      const transaction = {
        from: this.account,
        to: BASE_X402_CONFIG.contractAddress,
        value: amountInWei,
        data: this.encodePaymentData(planId, userId),
        gas: '21000'
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });

      // Track payment
      await this.trackX402Payment(txHash, planId, userId, plan.basePrice);

      return {
        success: true,
        transactionHash: txHash,
        planId,
        amount: plan.basePrice
      };
    } catch (error) {
      console.error('X402 payment failed:', error);
      throw error;
    }
  }

  /**
   * Encode payment data for smart contract
   */
  encodePaymentData(planId, userId) {
    // Simple encoding - in production, use proper ABI encoding
    const planCode = planId === 'basic' ? '01' : planId === 'premium' ? '02' : '03';
    const userIdHex = Buffer.from(userId).toString('hex').padStart(64, '0');
    return '0x' + planCode + userIdHex;
  }

  /**
   * Track X402 payment in backend
   */
  async trackX402Payment(txHash, planId, userId, amount) {
    try {
      await axios.post(`${STRIPE_CONFIG.apiUrl}/payments/x402`, {
        transactionHash: txHash,
        planId,
        userId,
        amount,
        chainId: BASE_X402_CONFIG.chainId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track X402 payment:', error);
      // Don't throw - payment was successful even if tracking failed
    }
  }

  /**
   * Verify X402 payment status
   */
  async verifyX402Payment(txHash) {
    try {
      const response = await axios.get(`${STRIPE_CONFIG.apiUrl}/payments/x402/${txHash}/verify`);
      return response.data;
    } catch (error) {
      console.error('Failed to verify X402 payment:', error);
      return { verified: false, error: error.message };
    }
  }
}

/**
 * Stripe Payment Implementation
 */
export class StripePayment {
  constructor(stripeInstance) {
    this.stripe = stripeInstance;
  }

  /**
   * Create Stripe subscription
   */
  async createSubscription(planId, userId, paymentMethodId) {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiUrl}/payments/stripe/create-subscription`, {
        planId,
        userId,
        paymentMethodId,
        priceId: plan.stripePriceId,
        price: plan.price
      });

      const { clientSecret, subscriptionId } = response.data;

      // Confirm payment with Stripe
      const result = await this.stripe.confirmCardPayment(clientSecret);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        success: true,
        subscriptionId,
        planId,
        amount: plan.price
      };
    } catch (error) {
      console.error('Stripe subscription creation failed:', error);
      throw error;
    }
  }

  /**
   * Create one-time payment
   */
  async createOneTimePayment(amount, description, userId) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiUrl}/payments/stripe/create-payment-intent`, {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        description,
        userId
      });

      const { clientSecret } = response.data;

      return {
        clientSecret,
        amount
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, userId) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiUrl}/payments/stripe/cancel-subscription`, {
        subscriptionId,
        userId
      });

      return response.data;
    } catch (error) {
      console.error('Stripe subscription cancellation failed:', error);
      throw error;
    }
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(subscriptionId, paymentMethodId, userId) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiUrl}/payments/stripe/update-payment-method`, {
        subscriptionId,
        paymentMethodId,
        userId
      });

      return response.data;
    } catch (error) {
      console.error('Stripe payment method update failed:', error);
      throw error;
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      const response = await axios.get(`${STRIPE_CONFIG.apiUrl}/payments/stripe/subscription-status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return { active: false, plan: null };
    }
  }
}

/**
 * Unified Payment Manager
 */
export class PaymentManager {
  constructor() {
    this.baseX402 = new BaseX402Payment();
    this.stripe = null;
    this.stripePayment = null;
  }

  /**
   * Initialize payment systems
   */
  async initialize(stripeInstance = null) {
    if (stripeInstance) {
      this.stripe = stripeInstance;
      this.stripePayment = new StripePayment(stripeInstance);
    }

    // Base X402 initialization is done on-demand
    return true;
  }

  /**
   * Process payment with preferred method
   */
  async processPayment(method, planId, userId, paymentData = {}) {
    switch (method) {
      case 'base-x402':
        return await this.baseX402.createX402Payment(planId, userId);
      
      case 'stripe':
        if (!this.stripePayment) {
          throw new Error('Stripe not initialized');
        }
        return await this.stripePayment.createSubscription(planId, userId, paymentData.paymentMethodId);
      
      default:
        throw new Error('Unsupported payment method');
    }
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods() {
    const methods = [];

    // Check if MetaMask/Web3 is available for Base X402
    if (typeof window !== 'undefined' && window.ethereum) {
      methods.push({
        id: 'base-x402',
        name: 'Base X402 (Crypto)',
        description: 'Pay with cryptocurrency on Base network',
        icon: '⛓️',
        fees: 'Low network fees'
      });
    }

    // Stripe is always available (server-side)
    methods.push({
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay with credit or debit card',
      icon: '💳',
      fees: 'Standard processing fees'
    });

    return methods;
  }

  /**
   * Get subscription plans
   */
  getSubscriptionPlans() {
    return SUBSCRIPTION_PLANS;
  }
}

// Export singleton instance
export const paymentManager = new PaymentManager();

export default {
  PaymentManager,
  BaseX402Payment,
  StripePayment,
  paymentManager,
  SUBSCRIPTION_PLANS
};