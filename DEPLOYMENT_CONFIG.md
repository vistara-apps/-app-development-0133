# Deployment Configuration Guide

## Environment Variables Required

Create a `.env` file in your project root with the following variables:

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

# App Configuration
VITE_APP_NAME=ResilientFlow
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

## Quick Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy Supabase Edge Functions
```bash
# Install Supabase CLI if not already installed
npm install supabase --save-dev

# Login to Supabase
npx supabase login

# Deploy Edge Functions
npx supabase functions deploy stripe-webhooks
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-subscription
```

### 3. Set Supabase Secrets
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
npx supabase secrets set FRONTEND_URL=https://your-domain.com
```

## Vercel Deployment (Recommended)

### Option 1: Deploy from GitHub (Easiest)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically detect it's a Vite React app
4. Set environment variables in Vercel dashboard
5. Deploy with one click!

### Option 2: Deploy from Local Build
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts
4. Set environment variables when prompted

### Option 3: Deploy Built Files
1. Run `npm run build`
2. Deploy the `dist/` folder to Vercel
3. Set environment variables in dashboard

## Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PREMIUM_PRICE_ID`
- `VITE_STRIPE_ENTERPRISE_PRICE_ID`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_API_KEY`

## Production Deployment Options

### Option 1: Vercel (Recommended)
- ✅ Automatic deployments from Git
- ✅ Built-in CDN and edge functions
- ✅ Automatic HTTPS
- ✅ Zero configuration
- ✅ Free tier available

### Option 2: Netlify
- Similar to Vercel
- Good for static sites
- Free tier available

### Option 3: Traditional Server
- Copy `dist/` folder to web server directory
- Configure nginx/apache to serve static files
- More complex setup

## Post-Deployment Checklist

- [ ] Environment variables are set correctly in Vercel
- [ ] Supabase Edge Functions are deployed
- [ ] Database schema is applied
- [ ] Stripe webhooks are configured
- [ ] Domain is configured (Vercel provides free subdomain)
- [ ] SSL is automatically handled by Vercel

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (requires 18+)
2. **Environment variables not loading**: Ensure they're set in Vercel dashboard
3. **Supabase connection fails**: Verify URL and API keys
4. **Vercel deployment fails**: Check build logs and environment variables

## Why Vercel is Better Than Docker

- **No Docker knowledge required**
- **Automatic builds and deployments**
- **Built-in CDN and edge functions**
- **Automatic HTTPS and SSL**
- **Zero server management**
- **Free tier available**
- **Git integration for automatic deployments**
