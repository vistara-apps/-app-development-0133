import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Import Stripe
    const { Stripe } = await import('https://esm.sh/stripe@12.0.0')
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    if (req.method === 'POST') {
      // Create subscription
      const { priceId, userId, planId, paymentMethodId } = await req.json()

      if (!priceId || !userId || !paymentMethodId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create or retrieve customer
      let customer
      const existingCustomers = await stripe.customers.list({
        email: `user-${userId}@resilientflow.app`,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: `user-${userId}@resilientflow.app`,
          metadata: { userId }
        })
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      })

      // Set as default payment method
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          planId
        }
      })

      // Save to Supabase
      const { error } = await supabase.from('subscriptions').insert({
        user_id: userId,
        plan_id: planId,
        status: subscription.status,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        payment_method: 'stripe',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })

      if (error) {
        console.error('Error saving subscription to Supabase:', error)
      }

      return new Response(
        JSON.stringify(subscription),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } else if (req.method === 'DELETE') {
      // Cancel subscription
      const { subscriptionId, userId } = await req.json()

      if (!subscriptionId || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Cancel at period end to maintain access until billing cycle ends
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          cancelledBy: userId,
          cancelledAt: new Date().toISOString()
        }
      })

      // Update in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          cancel_at_period_end: true,
          status: subscription.status
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (error) {
        console.error('Error updating cancelled subscription in Supabase:', error)
      }

      return new Response(
        JSON.stringify({ success: true, subscription }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } else if (req.method === 'GET') {
      // Get subscription status
      const url = new URL(req.url)
      const userId = url.searchParams.get('userId')

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Missing userId parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get from Supabase first (faster)
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting subscription from Supabase:', error)
        return new Response(
          JSON.stringify({ error: 'Database error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!subscription) {
        return new Response(
          JSON.stringify({ 
            hasActiveSubscription: false,
            plan: 'basic'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      // Optionally verify with Stripe
      if (subscription.stripe_subscription_id) {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        
        // Update Supabase if status changed
        if (stripeSubscription.status !== subscription.status) {
          await supabase
            .from('subscriptions')
            .update({ status: stripeSubscription.status })
            .eq('id', subscription.id)
        }
      }

      return new Response(
        JSON.stringify({
          hasActiveSubscription: subscription.status === 'active',
          plan: subscription.plan_id,
          subscription
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

  } catch (error) {
    console.error('Subscription operation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})