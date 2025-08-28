# Complete Setup Guide - ResilientFlow Real Integrations

Follow these steps exactly to set up and test the full application with real APIs.

## Step 1: Supabase Database Setup

1. **Create Supabase Project**
   - Go to https://supabase.com and create a new project
   - Wait for project to be ready (2-3 minutes)

2. **Run Database Schema**
   - Go to your Supabase Dashboard → SQL Editor
   - Copy and paste the ENTIRE contents of `supabase-schema.sql` 
   - Click "Run" to execute all tables, policies, and functions

3. **Get Supabase Keys**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (keep this secret!)

## Step 2: Stripe Setup (for Payments)

1. **Create Stripe Account**
   - Go to https://stripe.com and create account
   - Get your test keys from Dashboard → Developers → API Keys

2. **Create Products in Stripe**
   - Go to Products → Add Product
   - Create "Premium Plan" - $9.99/month recurring
   - Create "Enterprise Plan" - $29.99/month recurring
   - Copy the `price_id` for each (starts with `price_`)

3. **Set up Webhook** (we'll do this after deploying Edge Functions)

## Step 3: OpenAI Setup (for AI Insights)

1. **Create OpenAI Account**
   - Go to https://platform.openai.com
   - Add billing method (required for GPT-4 access)
   - Generate API key from API Keys section

## Step 4: Deploy Supabase Edge Functions

1. **Install Supabase CLI**
   ```bash
   npm install supabase --save-dev
   ```

2. **Login and Link Project**
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-id
   ```

3. **Deploy Edge Functions**
   ```bash
   npx supabase functions deploy stripe-webhooks
   npx supabase functions deploy stripe-checkout
   npx supabase functions deploy stripe-subscription
   ```

4. **Set Edge Function Secrets**
   ```bash
   npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   npx supabase secrets set FRONTEND_URL=http://localhost:5173
   ```

## Step 5: Configure Stripe Webhook

1. **Get Edge Function URL**
   - Your webhook URL: `https://your-project-id.supabase.co/functions/v1/stripe-webhooks`

2. **Add Webhook in Stripe**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - URL: Your Edge Function URL above
   - Select these events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Get Webhook Secret**
   - After creating webhook, click on it and copy the "Signing secret"
   - Update your Edge Function secrets:
   ```bash
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret
   ```

## Step 6: Update Your .env File

Replace placeholder values with your real API keys:

```env
# Supabase Configuration (Replace with your real values)
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# OpenAI Configuration (Replace with your real API key)
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key

# Stripe Configuration (Replace with your real keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
VITE_STRIPE_PREMIUM_PRICE_ID=price_your_actual_premium_price_id
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_your_actual_enterprise_price_id

# Keep these as-is for now
VITE_BASE_PAYMENT_CONTRACT=0x1234567890123456789012345678901234567890
VITE_BASE_API_KEY=demo_base_api_key_for_testing
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_APP_NAME=ResilientFlow
VITE_APP_VERSION=1.0.0
FRONTEND_URL=http://localhost:5173
```

## Step 7: Test End-to-End

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Go to http://localhost:5173
   - Click "Sign In" and create a new account
   - Complete onboarding

3. **Test Daily Check-in**
   - Fill out emotional state form
   - Verify data is saved to Supabase (check your database tables)

4. **Test Activities** 
   - Complete an activity and rate it
   - Check activity_logs table in Supabase

5. **Test AI Insights** (Premium Feature)
   - Go to Insights page
   - If you have OpenAI key configured, it should generate real insights
   - If not configured, it falls back to mock data

6. **Test Payments**
   - Go to Pricing page
   - Click "Upgrade to Premium"
   - Use Stripe test card: `4242 4242 4242 4242`, any future date, any CVC
   - Complete payment flow
   - Check subscriptions table in Supabase

7. **Check Webhooks**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook to see recent deliveries
   - Should show successful events when you test payments

## Troubleshooting

### Common Issues:

1. **Database Connection Issues**
   - Check your SUPABASE_URL and ANON_KEY are correct
   - Ensure RLS policies are created (run the full schema)

2. **Payment Issues**
   - Verify Edge Functions are deployed: `npx supabase functions list`
   - Check Edge Function logs: `npx supabase functions logs stripe-webhooks`
   - Test webhook delivery in Stripe dashboard

3. **AI Issues**
   - Ensure OpenAI API key is valid and has billing
   - Check browser console for errors

4. **Authentication Issues**
   - Enable email auth in Supabase Dashboard → Authentication → Settings

## Testing with Mock Data (No Setup Required)

If you want to test without real APIs:
- Just run `npm run dev` with the default .env
- App will automatically use mock data for everything
- All features work but data isn't persisted

## Deployment to Production

1. Deploy frontend to Vercel/Netlify
2. Update FRONTEND_URL in Edge Function secrets
3. Update webhook URLs in Stripe to production URLs
4. Use production Stripe keys and OpenAI keys
5. Your Supabase Edge Functions are already deployed and ready!

---

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Deploy Edge Functions (after setting up Supabase)
npx supabase functions deploy stripe-webhooks
npx supabase functions deploy stripe-checkout  
npx supabase functions deploy stripe-subscription

# 3. Set secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 4. Start development
npm run dev
```

The app intelligently detects which APIs are configured and uses real integrations when available, falling back to mock data otherwise!