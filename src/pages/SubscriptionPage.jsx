import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useAuthStore } from '../stores/authStore';
import { 
  getStripe, 
  createCheckoutSession, 
  createCustomerPortalSession,
  checkSubscriptionStatus
} from '../services/stripeService';
import { Crown, Check, AlertCircle } from 'lucide-react';

export function SubscriptionPage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        setLoading(true);
        const status = await checkSubscriptionStatus(user.userId);
        setSubscription(status);
        
        // Update user subscription tier based on status
        if (status.active && status.plan === 'premium') {
          updateUser({ subscriptionTier: 'premium' });
        }
      } catch (err) {
        setError('Failed to load subscription status');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user.userId, updateUser]);

  const handleSubscribe = async (priceId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create checkout session
      const { sessionId } = await createCheckoutSession(priceId, user.userId);
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to initiate checkout');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create customer portal session
      const { url } = await createCustomerPortalSession(user.userId);
      
      // Redirect to customer portal
      window.location.href = url;
    } catch (err) {
      setError('Failed to open subscription management');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, directly update subscription
  const handleDemoUpgrade = () => {
    updateUser({ subscriptionTier: 'premium' });
    setSubscription({
      active: true,
      plan: 'premium',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  if (loading && !subscription) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  const isPremium = user.subscriptionTier === 'premium';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      {/* Current subscription status */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
            <div className="flex items-center">
              {isPremium ? (
                <>
                  <Crown className="w-5 h-5 text-accent mr-2" />
                  <span className="font-medium">Premium</span>
                </>
              ) : (
                <span className="font-medium">Free</span>
              )}
            </div>
            
            {isPremium && subscription?.currentPeriodEnd && (
              <p className="text-sm text-text-secondary mt-2">
                Your subscription renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {isPremium && (
            <Button onClick={handleManageSubscription} variant="outline">
              Manage Subscription
            </Button>
          )}
        </div>
      </Card>
      
      {/* Subscription plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free plan */}
        <Card className="p-6 border-2 border-primary/20">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal text-text-secondary">/month</span></p>
          
          <ul className="space-y-3 mb-6">
            <PlanFeature text="Basic emotional tracking" />
            <PlanFeature text="Limited activity library" />
            <PlanFeature text="7-day data history" />
            <PlanFeature text="Basic insights" included={false} />
            <PlanFeature text="Personalized recommendations" included={false} />
          </ul>
          
          {!isPremium ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleManageSubscription}
            >
              Downgrade
            </Button>
          )}
        </Card>
        
        {/* Premium plan */}
        <Card className="p-6 border-2 border-accent">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold">Premium</h3>
            <span className="ml-2 px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
              Recommended
            </span>
          </div>
          
          <p className="text-2xl font-bold mb-4">$10<span className="text-sm font-normal text-text-secondary">/month</span></p>
          
          <ul className="space-y-3 mb-6">
            <PlanFeature text="Advanced emotional tracking" />
            <PlanFeature text="Full activity library" />
            <PlanFeature text="Unlimited data history" />
            <PlanFeature text="AI-powered insights" />
            <PlanFeature text="Personalized recommendations" />
          </ul>
          
          {isPremium ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <>
              {/* In production, use handleSubscribe with actual price ID */}
              <Button 
                className="w-full"
                onClick={handleDemoUpgrade}
                loading={loading}
              >
                Upgrade to Premium
              </Button>
              <p className="text-center text-sm text-text-secondary mt-2">
                Demo mode: Click to simulate upgrade
              </p>
            </>
          )}
        </Card>
      </div>
      
      {/* FAQ section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <FAQ 
            question="Can I cancel my subscription anytime?"
            answer="Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period."
          />
          
          <FAQ 
            question="How will I be billed?"
            answer="You'll be billed monthly on the date you initially subscribed. We accept all major credit cards and process payments securely through Stripe."
          />
          
          <FAQ 
            question="Is there a free trial?"
            answer="We don't currently offer a free trial, but our free plan allows you to experience the core features of ResilientFlow before upgrading."
          />
          
          <FAQ 
            question="What happens to my data if I downgrade?"
            answer="Your historical data will be preserved, but you'll only be able to access the most recent 7 days of data on the free plan. If you upgrade again, you'll regain access to all your historical data."
          />
        </div>
      </div>
    </div>
  );
}

function PlanFeature({ text, included = true }) {
  return (
    <li className="flex items-center">
      <div className={`flex-shrink-0 w-5 h-5 rounded-full ${included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center mr-3`}>
        {included ? (
          <Check className="w-3 h-3" />
        ) : (
          <span className="w-3 h-0.5 bg-current" />
        )}
      </div>
      <span className={included ? 'text-text-primary' : 'text-text-secondary'}>{text}</span>
    </li>
  );
}

function FAQ({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {question}
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="mt-2 text-text-secondary">
          {answer}
        </div>
      )}
    </div>
  );
}

