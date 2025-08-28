/**
 * Real Stripe Payment Service for ResilientFlow
 * 
 * This service handles real Stripe payments, subscription management,
 * and webhook processing for premium features.
 */

import { Subscriptions } from './supabase';

// Stripe Configuration
const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY, // Only use server-side
  apiUrl: import.meta.env.VITE_SUPABASE_URL + '/functions/v1'
};

// Real Subscription Plans (match your Stripe products)
export const REAL_SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 0,
    interval: 'month',
    basePrice: 0,
    stripePriceId: null, // Free plan
    features: [
      'Daily emotional check-ins',
      'Basic activity tracking',
      'Simple progress charts',
      'Community access'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan', 
    price: 9.99,
    interval: 'month',
    basePrice: 0.01, // ~$10 in ETH
    stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    features: [
      'All Basic features',
      'AI-powered insights',
      'Advanced analytics',
      'Weekly progress reports',
      'Priority support',
      'Support circle creation'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 29.99,
    interval: 'month', 
    basePrice: 0.03, // ~$30 in ETH
    stripePriceId: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'All Premium features',
      'Advanced AI coaching',
      'Custom integrations',
      'Priority phone support',
      'Team management',
      'Custom branding'
    ]
  }
};

/**
 * Real Stripe Payment Manager
 */
export class RealStripePayment {
  constructor() {
    this.stripe = null;
    this.initialized = false;
  }

  async initialize(stripeInstance) {
    this.stripe = stripeInstance;
    this.initialized = true;
    return true;
  }

  /**
   * Create a Stripe Checkout Session for subscriptions
   */
  async createCheckoutSession(planId, userId, successUrl, cancelUrl) {
    try {
      const plan = REAL_SUBSCRIPTION_PLANS[planId];
      if (!plan || !plan.stripePriceId) {
        throw new Error('Invalid plan or price ID');
      }

      const response = await fetch(`${STRIPE_CONFIG.apiUrl}/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId,
          planId,
          successUrl,
          cancelUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      
      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { success: true, sessionId: session.id };

    } catch (error) {
      console.error('Stripe checkout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a subscription with payment method
   */
  async createSubscription(planId, userId, paymentMethodId) {
    try {
      const plan = REAL_SUBSCRIPTION_PLANS[planId];
      if (!plan || !plan.stripePriceId) {
        throw new Error('Invalid plan');
      }

      const response = await fetch(`${STRIPE_CONFIG.apiUrl}/stripe-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId,
          planId,
          paymentMethodId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const subscription = await response.json();
      
      // Save to Supabase
      await Subscriptions.create({
        user_id: userId,
        plan_id: planId,
        status: subscription.status,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        payment_method: 'stripe',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        planId,
        amount: plan.price
      };

    } catch (error) {
      console.error('Subscription creation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId, userId) {
    try {
      const response = await fetch(`${STRIPE_CONFIG.apiUrl}/stripe-subscription`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          subscriptionId,
          userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const result = await response.json();
      
      // Update in Supabase
      const subscription = await Subscriptions.getByUserId(userId);
      if (subscription && subscription.stripe_subscription_id === subscriptionId) {
        await Subscriptions.update(subscription.id, {
          status: 'canceled',
          cancel_at_period_end: true
        });
      }

      return { success: true };

    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      const subscription = await Subscriptions.getByUserId(userId);
      
      if (!subscription) {
        return {
          hasActiveSubscription: false,
          plan: REAL_SUBSCRIPTION_PLANS.basic,
          status: 'inactive'
        };
      }

      const plan = REAL_SUBSCRIPTION_PLANS[subscription.plan_id] || REAL_SUBSCRIPTION_PLANS.basic;
      
      return {
        hasActiveSubscription: subscription.status === 'active',
        plan,
        subscription,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };

    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        hasActiveSubscription: false,
        plan: REAL_SUBSCRIPTION_PLANS.basic,
        status: 'error'
      };
    }
  }
}

/**
 * Base X402 Blockchain Payment (Mock for now)
 */
export class BaseX402Payment {
  async processPayment(planId, userId) {
    try {
      // Mock blockchain payment processing
      // In production, integrate with Base network
      
      const plan = REAL_SUBSCRIPTION_PLANS[planId];
      if (!plan) {
        throw new Error('Invalid plan');
      }

      // Simulate blockchain transaction
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Save to Supabase
      await Subscriptions.create({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        payment_method: 'base-x402',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });

      return {
        success: true,
        transactionHash: mockTransactionHash,
        planId,
        amount: plan.basePrice
      };

    } catch (error) {
      console.error('Base X402 payment error:', error);
      return { success: false, error: error.message };
    }
  }
}

/**
 * Main Payment Manager
 */
export class RealPaymentManager {
  constructor() {
    this.stripePayment = new RealStripePayment();
    this.basePayment = new BaseX402Payment();
    this.initialized = false;
  }

  async initialize(stripeInstance) {
    await this.stripePayment.initialize(stripeInstance);
    this.initialized = true;
  }

  async processPayment(method, planId, userId, paymentData = {}) {
    if (!this.initialized) {
      throw new Error('Payment manager not initialized');
    }

    switch (method) {
      case 'stripe':
        if (paymentData.useCheckout) {
          // Use Stripe Checkout
          return await this.stripePayment.createCheckoutSession(
            planId, 
            userId, 
            paymentData.successUrl, 
            paymentData.cancelUrl
          );
        } else {
          // Use payment method directly
          return await this.stripePayment.createSubscription(
            planId, 
            userId, 
            paymentData.paymentMethodId
          );
        }
        
      case 'base-x402':
        return await this.basePayment.processPayment(planId, userId);
        
      default:
        throw new Error('Unsupported payment method');
    }
  }

  getAvailablePaymentMethods() {
    return [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Secure payment via Stripe',
        icon: '💳',
        fees: 'Standard processing fees apply'
      },
      {
        id: 'base-x402',
        name: 'Base Network (X402)',
        description: 'Pay with cryptocurrency on Base blockchain',
        icon: '⛓️',
        fees: 'Low blockchain fees'
      }
    ];
  }

  async getSubscriptionStatus(userId) {
    return await this.stripePayment.getSubscriptionStatus(userId);
  }
}

// Export singleton instance
export const realPaymentManager = new RealPaymentManager();

// Export plans
export { REAL_SUBSCRIPTION_PLANS as SUBSCRIPTION_PLANS };

export default realPaymentManager;