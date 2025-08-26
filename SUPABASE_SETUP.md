# Supabase Setup Guide for ResilientFlow

This guide will walk you through setting up Supabase for the ResilientFlow application.

## 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com)
2. Create a new project
3. Choose a name for your project (e.g., "resilient-flow")
4. Set a secure database password
5. Choose a region closest to your users
6. Wait for your project to be created

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to Project Settings > API
2. You'll need two keys:
   - **URL**: Your project URL (e.g., `https://abcdefghijklm.supabase.co`)
   - **anon key**: Your public API key

## 3. Set Up Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist already)
2. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Replace `your_supabase_url` and `your_supabase_anon_key` with the values from step 2

## 4. Set Up Database Schema

You can set up the database schema in two ways:

### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy the contents of `supabase/schema.sql` from this repository
4. Run the query

### Option 2: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```
   supabase init
   ```

3. Link to your remote project:
   ```
   supabase link --project-ref your-project-ref
   ```

4. Push the schema:
   ```
   supabase db push
   ```

## 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following settings:
   - Site URL: Your application's URL (e.g., `http://localhost:5173` for development)
   - Redirect URLs: Add your application's URL with `/auth/callback` (e.g., `http://localhost:5173/auth/callback`)
   - Enable Email/Password sign-in method

## 6. Set Up Row Level Security (RLS) Policies

The schema file already includes RLS policies, but you can verify they're set up correctly:

1. In your Supabase dashboard, go to Database > Tables
2. For each table, check the RLS tab to ensure policies are in place
3. The policies should ensure users can only access their own data

## 7. Test Your Setup

1. Start your application:
   ```
   npm run dev
   ```

2. Try to sign up and sign in
3. Verify that data is being stored in your Supabase database

## Troubleshooting

- **Authentication Issues**: Check your site URL and redirect URLs in the Authentication settings
- **Database Access Issues**: Verify your RLS policies are set up correctly
- **API Connection Issues**: Double-check your environment variables

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

