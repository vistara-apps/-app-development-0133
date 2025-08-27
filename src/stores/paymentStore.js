import { create } from 'zustand';
import { paymentManager, SUBSCRIPTION_PLANS } from '../services/PaymentService';

export const usePaymentStore = create((set, get) => ({
  // Payment state
  currentSubscription: null,
  subscriptionStatus: 'inactive', // 'inactive', 'active', 'canceled', 'past_due'
  paymentMethod: null,
  paymentHistory: [],
  
  // UI state
  isProcessingPayment: false,
  showPaymentModal: false,
  selectedPlan: null,
  paymentError: null,
  
  // Actions
  setCurrentSubscription: (subscription) => set({ currentSubscription: subscription }),
  
  setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  setPaymentHistory: (history) => set({ paymentHistory: history }),
  
  setProcessingPayment: (processing) => set({ isProcessingPayment: processing }),
  
  showPaymentModal: (planId = null) => set({ 
    showPaymentModal: true, 
    selectedPlan: planId ? SUBSCRIPTION_PLANS[planId] : null 
  }),
  
  hidePaymentModal: () => set({ 
    showPaymentModal: false, 
    selectedPlan: null,
    paymentError: null 
  }),
  
  setPaymentError: (error) => set({ paymentError: error }),
  
  clearPaymentError: () => set({ paymentError: null }),
  
  // Initialize payment manager
  initializePayments: async (stripeInstance) => {
    try {
      await paymentManager.initialize(stripeInstance);
      return true;
    } catch (error) {
      console.error('Failed to initialize payment manager:', error);
      return false;
    }
  },
  
  // Process subscription payment
  processSubscriptionPayment: async (method, planId, userId, paymentData = {}) => {
    const state = get();
    
    if (state.isProcessingPayment) {
      return { success: false, error: 'Payment already in progress' };
    }
    
    set({ isProcessingPayment: true, paymentError: null });
    
    try {
      const result = await paymentManager.processPayment(method, planId, userId, paymentData);
      
      if (result.success) {
        // Update subscription state
        set({
          currentSubscription: {
            planId: result.planId,
            status: 'active',
            method: method,
            subscriptionId: result.subscriptionId || result.transactionHash,
            startDate: new Date().toISOString(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          },
          subscriptionStatus: 'active',
          showPaymentModal: false,
          selectedPlan: null
        });
        
        // Add to payment history
        const newPayment = {
          id: `payment-${Date.now()}`,
          planId: result.planId,
          amount: result.amount,
          method: method,
          status: 'completed',
          transactionId: result.subscriptionId || result.transactionHash,
          date: new Date().toISOString()
        };
        
        set(state => ({
          paymentHistory: [newPayment, ...state.paymentHistory]
        }));
      }
      
      set({ isProcessingPayment: false });
      return result;
    } catch (error) {
      set({ 
        isProcessingPayment: false,
        paymentError: error.message || 'Payment processing failed'
      });
      
      return { 
        success: false, 
        error: error.message || 'Payment processing failed' 
      };
    }
  },
  
  // Cancel subscription
  cancelSubscription: async (userId) => {
    const state = get();
    
    if (!state.currentSubscription) {
      return { success: false, error: 'No active subscription to cancel' };
    }
    
    set({ isProcessingPayment: true, paymentError: null });
    
    try {
      let result = { success: true };
      
      if (state.currentSubscription.method === 'stripe' && state.paymentMethod?.stripePayment) {
        result = await state.paymentMethod.stripePayment.cancelSubscription(
          state.currentSubscription.subscriptionId, 
          userId
        );
      }
      
      if (result.success) {
        set({
          currentSubscription: {
            ...state.currentSubscription,
            status: 'canceled',
            cancelDate: new Date().toISOString()
          },
          subscriptionStatus: 'canceled'
        });
      }
      
      set({ isProcessingPayment: false });
      return result;
    } catch (error) {
      set({ 
        isProcessingPayment: false,
        paymentError: error.message || 'Subscription cancellation failed'
      });
      
      return { 
        success: false, 
        error: error.message || 'Subscription cancellation failed' 
      };
    }
  },
  
  // Load subscription status
  loadSubscriptionStatus: async (userId) => {
    try {
      // In a real app, this would fetch from your backend
      // For demo purposes, check localStorage
      const savedSubscription = localStorage.getItem(`subscription-${userId}`);
      
      if (savedSubscription) {
        const subscription = JSON.parse(savedSubscription);
        set({
          currentSubscription: subscription,
          subscriptionStatus: subscription.status || 'active'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to load subscription status:', error);
      return false;
    }
  },
  
  // Save subscription to localStorage (for demo)
  saveSubscriptionLocally: (userId) => {
    const state = get();
    if (state.currentSubscription) {
      localStorage.setItem(
        `subscription-${userId}`, 
        JSON.stringify(state.currentSubscription)
      );
    }
  },
  
  // Get available plans
  getAvailablePlans: () => SUBSCRIPTION_PLANS,
  
  // Get available payment methods
  getAvailablePaymentMethods: () => paymentManager.getAvailablePaymentMethods(),
  
  // Check if user has active subscription
  hasActiveSubscription: () => {
    const state = get();
    return state.subscriptionStatus === 'active' && state.currentSubscription;
  },
  
  // Check if user has premium features
  hasPremiumFeatures: () => {
    const state = get();
    if (!state.hasActiveSubscription()) return false;
    
    return ['premium', 'enterprise'].includes(state.currentSubscription.planId);
  },
  
  // Check if user has enterprise features
  hasEnterpriseFeatures: () => {
    const state = get();
    if (!state.hasActiveSubscription()) return false;
    
    return state.currentSubscription.planId === 'enterprise';
  },
  
  // Get current plan details
  getCurrentPlan: () => {
    const state = get();
    if (!state.currentSubscription) return null;
    
    return SUBSCRIPTION_PLANS[state.currentSubscription.planId] || null;
  }
}));