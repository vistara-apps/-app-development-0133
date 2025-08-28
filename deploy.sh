#!/bin/bash

# ResilientFlow Deployment Script
# Run this after setting up your Supabase project and getting API keys

echo "🚀 Deploying ResilientFlow with Real Integrations"
echo "================================================="

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install supabase --save-dev
fi

echo "📡 Deploying Supabase Edge Functions..."

# Deploy all edge functions
echo "Deploying stripe-webhooks..."
npx supabase functions deploy stripe-webhooks

echo "Deploying stripe-checkout..."
npx supabase functions deploy stripe-checkout

echo "Deploying stripe-subscription..."
npx supabase functions deploy stripe-subscription

echo "✅ Edge Functions deployed successfully!"

echo ""
echo "🔑 Next Steps:"
echo "1. Run the SQL schema in your Supabase SQL Editor (see supabase-schema.sql)"
echo "2. Update your .env file with real API keys"
echo "3. Set Edge Function secrets:"
echo ""
echo "npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key"
echo "npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret"
echo "npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo "npx supabase secrets set FRONTEND_URL=http://localhost:5173"
echo ""
echo "4. Set up Stripe webhook pointing to:"
echo "   https://your-project-id.supabase.co/functions/v1/stripe-webhooks"
echo ""
echo "5. Start the development server: npm run dev"
echo ""
echo "🎉 Your ResilientFlow app will be ready with real integrations!"