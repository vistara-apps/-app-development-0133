# Stripe Payments Integration for ResilientFlow

This document outlines the implementation of Stripe payments functionality for the ResilientFlow application.

## Overview

The Stripe integration allows ResilientFlow to offer a tiered subscription model:
- **Free Tier**: Basic tracking, limited activities
- **Premium Tier**: Full activity library, advanced insights, personalized plans ($10/month)

## Implementation Components

### 1. Frontend Components

- **SubscriptionPage**: Main page for managing subscriptions
- **CheckoutModal**: Modal for handling one-time payments
- **PaymentForm**: Component for collecting payment information
- **StripeProvider**: Context provider for Stripe Elements
- **PremiumFeature**: Component for gating premium features

### 2. Services

- **stripeService.js**: Core service for Stripe functionality
- **apiService.js**: Service for backend API communication
- **stripeWebhooks.js**: Handlers for Stripe webhook events

### 3. Integration Points

- **AppShell**: Updated to include subscription management
- **App.jsx**: Updated to include StripeProvider and subscription route

## Stripe Workflow

### Subscription Flow

1. User selects the Premium plan and clicks "Upgrade"
2. The app creates a Checkout Session via the API
3. User completes payment on Stripe Checkout
4. Webhook updates the user's subscription status
5. User gains premium access

### Subscription Management

1. User clicks "Manage Subscription"
2. The app creates a Customer Portal Session
3. User manages subscription on Stripe Customer Portal
4. Webhooks handle subscription changes

## Implementation Notes

For production deployment:
- Replace test keys with actual Stripe keys
- Implement actual API endpoints
- Set up webhook handling with signature verification
- Store subscription data in your database

