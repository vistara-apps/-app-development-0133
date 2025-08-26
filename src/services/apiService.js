/**
 * API Service
 * 
 * This file contains functions for interacting with the backend API.
 * In a real application, these would make actual HTTP requests to your server.
 * For this demo, we're simulating responses.
 */

import { useAuthStore } from '../stores/authStore';

// Base API URL - would point to your actual backend in production
const API_BASE_URL = 'https://api.resilientflow.com';

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  // In a real app, this would make an actual HTTP request
  // For demo purposes, we're simulating responses
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // In a real app, you would include authentication headers
      // 'Authorization': `Bearer ${getAuthToken()}`
    }
  };
  
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };
  
  // Log the request (for demo purposes)
  console.log(`API Request: ${requestOptions.method} ${url}`, {
    body: requestOptions.body,
    headers: requestOptions.headers
  });
  
  // In a real app, you would do:
  // const response = await fetch(url, requestOptions);
  // const data = await response.json();
  // if (!response.ok) throw new Error(data.message || 'API request failed');
  // return data;
  
  // For demo, simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockResponse(endpoint, requestOptions));
    }, 500);
  });
}

/**
 * Get a mock API response based on the endpoint and request
 * @param {string} endpoint - API endpoint
 * @param {Object} requestOptions - Request options
 * @returns {Object} - Mock response data
 */
function getMockResponse(endpoint, requestOptions) {
  // Get the current user for mock data
  const { user } = useAuthStore.getState();
  
  // Handle different endpoints
  switch (endpoint) {
    case '/stripe/create-checkout-session':
      return {
        sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 15)
      };
      
    case '/stripe/create-customer-portal-session':
      return {
        url: 'https://billing.stripe.com/p/session/' + Math.random().toString(36).substring(2, 15)
      };
      
    case '/stripe/subscription-status':
      return {
        active: user?.subscriptionTier === 'premium',
        plan: user?.subscriptionTier || 'free',
        currentPeriodEnd: user?.subscriptionTier === 'premium' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null
      };
      
    case '/user/profile':
      return {
        id: user?.userId,
        email: user?.email,
        username: user?.username,
        subscriptionTier: user?.subscriptionTier,
        createdAt: user?.createdAt
      };
      
    default:
      return { message: 'Endpoint not mocked' };
  }
}

// API service functions

/**
 * Create a Stripe Checkout session
 * @param {string} priceId - Stripe Price ID
 * @returns {Promise<Object>} - Session data with sessionId
 */
export async function createCheckoutSession(priceId) {
  return apiRequest('/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ priceId })
  });
}

/**
 * Create a Stripe Customer Portal session
 * @returns {Promise<Object>} - Session data with URL
 */
export async function createCustomerPortalSession() {
  return apiRequest('/stripe/create-customer-portal-session', {
    method: 'POST'
  });
}

/**
 * Get the current user's subscription status
 * @returns {Promise<Object>} - Subscription status data
 */
export async function getSubscriptionStatus() {
  return apiRequest('/stripe/subscription-status');
}

/**
 * Get the current user's profile
 * @returns {Promise<Object>} - User profile data
 */
export async function getUserProfile() {
  return apiRequest('/user/profile');
}

/**
 * Update the current user's profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Updated user profile
 */
export async function updateUserProfile(profileData) {
  return apiRequest('/user/profile', {
    method: 'PATCH',
    body: JSON.stringify(profileData)
  });
}

