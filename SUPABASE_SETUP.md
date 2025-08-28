# Supabase Setup Guide for ResilientFlow

This guide explains how to set up the real integrations with Supabase, including the database, Edge Functions, and environment configuration.

## 1. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Run the database schema from `supabase-schema.sql` in your Supabase SQL editor
3. This will create all necessary tables, RLS policies, and functions

## 2. Supabase Edge Functions

Deploy the Edge Functions for serverless Stripe integration:

### Install Supabase CLI
```bash
npm install supabase --save-dev
```

### Initialize Supabase
```bash
npx supabase login
npx supabase init
```

### Deploy Edge Functions
```bash
# Deploy all edge functions
npx supabase functions deploy stripe-webhooks
npx supabase functions deploy stripe-checkout  
npx supabase functions deploy stripe-subscription
```

### Set Environment Variables
```bash
# Set secrets for Edge Functions
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
npx supabase secrets set FRONTEND_URL=http://localhost:5173
```

## 3. Environment Configuration

Update your `.env` file with real API keys:

```env
# Supabase Configuration (Real Database)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# OpenAI Configuration (Real AI Insights)  
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Stripe Configuration (Real Payments via Edge Functions)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
VITE_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# Google APIs (Real Calendar Integration)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

## 4. Stripe Setup

1. Create a Stripe account and get your API keys
2. Create products and prices in Stripe Dashboard:
   - Premium Plan: $9.99/month
   - Enterprise Plan: $29.99/month
3. Set up webhooks pointing to your Supabase Edge Function:
   - Webhook URL: `https://your-project-id.supabase.co/functions/v1/stripe-webhooks`
   - Events to send: 
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated` 
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## 5. OpenAI Setup

1. Create an OpenAI account and get your API key
2. Add billing information to access GPT-4
3. Set the API key in your environment variables

## 6. Testing the Integration

Once everything is configured:

1. Start the development server: `npm run dev`
2. The app will automatically detect if real APIs are configured
3. If real APIs are not available, it falls back to mock data
4. Test payment flows with Stripe test cards
5. Test AI insights with real OpenAI integration

## 7. Deployment

For production deployment:

1. Deploy your Vite app to Vercel/Netlify
2. Your Supabase Edge Functions are already deployed
3. Update webhook URLs in Stripe to point to production
4. Use production Stripe keys and OpenAI keys

## Serverless Architecture Benefits

By using Supabase Edge Functions instead of a separate Express server:

- **Serverless**: No server management, automatic scaling
- **Integrated**: Everything in one Supabase project
- **Secure**: Service role keys kept server-side
- **Fast**: Global edge network
- **Cost-effective**: Pay only for what you use

## Troubleshooting

- Check Supabase logs for Edge Function errors
- Verify webhook signatures in Stripe dashboard
- Test Edge Functions locally with `supabase functions serve`
- Check environment variables are set correctly