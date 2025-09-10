# 🚀 Emogence Setup Guide

## ✅ What's Already Working
- ✅ **OpenAI API**: Connected and working
- ✅ **App Structure**: Simplified UI implemented
- ✅ **Environment Variables**: All set up
- ✅ **Development Server**: Running on http://localhost:5173

## 🔧 What You Need to Do

### 1. Set Up Supabase Database (5 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Open your project: `enlsvqrfgktlndrnbojk`

2. **Run the Database Schema**
   - Go to **SQL Editor** tab
   - Copy the entire content of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute

3. **Verify Tables Created**
   - Go to **Table Editor** tab
   - You should see these tables:
     - `user_profiles`
     - `daily_entries`
     - `activities`
     - `activity_logs`
     - `support_circles`
     - `circle_members`
     - `circle_messages`
     - `ai_insights`
     - `subscriptions`
     - `weekly_reports`

### 2. Test Your Services (2 minutes)

1. **Open the Test Page**
   - Go to: http://localhost:5173/test
   - Click **Run All Tests**
   - Verify all services show ✅

2. **Test the App**
   - Go to: http://localhost:5173
   - Try creating an account
   - Test the activities
   - Check the dashboard

### 3. Set Up Stripe (Optional - 10 minutes)

If you want to test payments:

1. **Create Stripe Account**
   - Go to: https://stripe.com
   - Create account and get API keys

2. **Add to Environment**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   VITE_STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PREMIUM_PRICE_ID=price_...
   VITE_STRIPE_ENTERPRISE_PRICE_ID=price_...
   ```

3. **Create Products in Stripe**
   - Premium Plan: $9.99/month
   - Enterprise Plan: $29.99/month

## 🎯 Current Status

| Service | Status | Notes |
|---------|--------|-------|
| OpenAI AI Features | ✅ Working | All AI insights, stress analysis, recommendations |
| Supabase Database | ⏳ Setup Needed | Run SQL schema in dashboard |
| Stripe Payments | ⏳ Optional | Add API keys if you want payments |
| Calendar Integration | ✅ Ready | Google Calendar integration available |
| Slack Integration | ✅ Ready | Slack integration available |
| App UI | ✅ Complete | Simplified, user-friendly interface |

## 🚀 Next Steps After Setup

1. **Test AI Features**
   - Go to Dashboard
   - Check AI insights section
   - Try different activities

2. **Test Integrations**
   - Go to /integrations
   - Connect Google Calendar
   - Connect Slack

3. **Test Circles**
   - Go to /circles
   - Create a support circle
   - Test messaging

## 🆘 Troubleshooting

### Supabase Connection Issues
- Check your project URL and API key
- Make sure you ran the SQL schema
- Verify tables exist in Table Editor

### OpenAI Issues
- Check your API key is valid
- Make sure you have credits in your OpenAI account
- Check browser console for errors

### App Not Loading
- Make sure dev server is running: `npm run dev`
- Check browser console for errors
- Verify all environment variables are set

## 📞 Need Help?

If you run into issues:
1. Check the browser console for errors
2. Go to `/test` page to run diagnostics
3. Check the terminal where `npm run dev` is running

Your app is almost ready! Just need to set up the database schema. 🎉