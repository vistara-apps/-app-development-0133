import React, { useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/authStore';
import { Check, Star, Zap, Crown } from 'lucide-react';

export function PricingPage() {
  const { user } = useAuthStore();
  const {
    currentSubscription,
    subscriptionStatus,
    showPaymentModal,
    hasActiveSubscription,
    getCurrentPlan,
    getAvailablePlans
  } = usePaymentStore();

  const plans = getAvailablePlans();
  const currentPlan = getCurrentPlan();

  const planIcons = {
    basic: Star,
    premium: Zap,
    enterprise: Crown
  };

  const planColors = {
    basic: 'border-blue-200 hover:border-blue-300',
    premium: 'border-purple-200 hover:border-purple-300 ring-2 ring-purple-100',
    enterprise: 'border-yellow-200 hover:border-yellow-300'
  };

  const planButtonColors = {
    basic: 'bg-blue-600 hover:bg-blue-700',
    premium: 'bg-purple-600 hover:bg-purple-700',
    enterprise: 'bg-yellow-600 hover:bg-yellow-700'
  };

  const handleSelectPlan = (planId) => {
    showPaymentModal(planId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Choose Your Resilience Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock powerful features to build emotional resilience and mental wellness.
          Choose the plan that fits your needs.
        </p>
      </div>

      {/* Current Subscription Status */}
      {hasActiveSubscription() && currentPlan && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  You're on the {currentPlan.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Status: {subscriptionStatus} • 
                  Next billing: {currentSubscription?.nextBillingDate ? 
                    new Date(currentSubscription.nextBillingDate).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Manage Subscription
            </Button>
          </div>
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(plans).map(([planId, plan]) => {
          const IconComponent = planIcons[planId];
          const isCurrentPlan = currentPlan?.id === planId;
          const isPremium = planId === 'premium';
          
          return (
            <Card 
              key={planId} 
              className={`relative p-8 transition-all duration-200 ${planColors[planId]} ${
                isPremium ? 'transform scale-105' : ''
              }`}
            >
              {/* Popular Badge for Premium */}
              {isPremium && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center space-y-6">
                {/* Plan Icon and Name */}
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className={`p-3 rounded-full ${
                      planId === 'basic' ? 'bg-blue-100' :
                      planId === 'premium' ? 'bg-purple-100' : 'bg-yellow-100'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        planId === 'basic' ? 'text-blue-600' :
                        planId === 'premium' ? 'text-purple-600' : 'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                </div>

                {/* Pricing */}
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </div>
                  <div className="text-gray-600">per {plan.interval}</div>
                  <div className="text-sm text-gray-500">
                    or {plan.basePrice} ETH on Base
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button 
                      className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full text-white ${planButtonColors[planId]}`}
                      onClick={() => handleSelectPlan(planId)}
                    >
                      {hasActiveSubscription() ? 'Upgrade to' : 'Get Started with'} {plan.name}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Payment Methods Info */}
      <Card className="p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Flexible Payment Options</h3>
          <p className="text-gray-600">
            Choose how you'd like to pay for your subscription
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl">💳</div>
              <div>
                <div className="font-medium text-gray-900">Credit/Debit Card</div>
                <div className="text-sm text-gray-600">
                  Secure payment via Stripe with standard processing fees
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl">⛓️</div>
              <div>
                <div className="font-medium text-gray-900">Base Network (X402)</div>
                <div className="text-sm text-gray-600">
                  Pay with cryptocurrency on Base blockchain with low fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ Section */}
      <Card className="p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                What's the difference between payment methods?
              </h4>
              <p className="text-gray-600">
                Credit card payments are processed instantly via Stripe with standard fees. 
                Base X402 payments use cryptocurrency on the Base network with lower transaction fees 
                but require a Web3 wallet like MetaMask.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll retain access to premium 
                features until the end of your current billing period.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Is my payment information secure?
              </h4>
              <p className="text-gray-600">
                Absolutely. Credit card payments are secured by Stripe's industry-leading security. 
                Cryptocurrency payments are processed on-chain with no sensitive information stored.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}