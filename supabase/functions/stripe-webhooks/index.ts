import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
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

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    if (!signature) {
      return new Response('No signature provided', { status: 400 })
    }

    // Import Stripe (you'll need to add this to your import map)
    const { Stripe } = await import('https://esm.sh/stripe@12.0.0')
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(`Webhook Error: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('Received Stripe webhook:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handleCheckoutSessionCompleted(session, supabase)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        await handleSubscriptionChange(subscription, 'updated', supabase)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await handleSubscriptionChange(subscription, 'deleted', supabase)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        await handlePaymentSucceeded(invoice, supabase)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await handlePaymentFailed(invoice, supabase)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: any, supabase: any) {
  const userId = session.metadata?.userId || session.client_reference_id
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    console.error('Missing userId or planId in checkout session')
    return
  }

  // Import Stripe to get subscription details
  const { Stripe } = await import('https://esm.sh/stripe@12.0.0')
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  })

  // Get the subscription
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  // Save to Supabase
  const { error } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    plan_id: planId,
    status: subscription.status,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    payment_method: 'stripe',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end || false
  })

  if (error) {
    console.error('Error saving subscription:', error)
  } else {
    console.log(`Subscription created for user ${userId}, plan ${planId}`)
  }
}

/**
 * Handle subscription changes
 */
async function handleSubscriptionChange(subscription: any, action: string, supabase: any) {
  const userId = subscription.metadata?.userId
  
  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  if (action === 'deleted') {
    // Mark as cancelled
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        cancel_at_period_end: true 
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Error updating cancelled subscription:', error)
    }
  } else {
    // Update subscription details
    const { error } = await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end || false
    })

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }

  console.log(`Subscription ${action} for user ${userId}`)
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: any, supabase: any) {
  const subscriptionId = invoice.subscription
  
  if (subscriptionId) {
    // Update subscription status to active
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('stripe_subscription_id', subscriptionId)
    
    if (error) {
      console.error('Error updating payment succeeded:', error)
    } else {
      console.log(`Payment succeeded for subscription ${subscriptionId}`)
    }
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: any, supabase: any) {
  const subscriptionId = invoice.subscription
  
  if (subscriptionId) {
    // Update subscription status to past_due
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', subscriptionId)
    
    if (error) {
      console.error('Error updating payment failed:', error)
    } else {
      console.log(`Payment failed for subscription ${subscriptionId}`)
    }
  }
}