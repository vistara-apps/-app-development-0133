import React, { useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/authStore';
import { 
  CreditCard, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Zap, 
  Star, 
  Crown,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubscriptionSettings() {
  const { user } = useAuthStore();
  const {
    currentSubscription,
    subscriptionStatus,
    paymentHistory,
    hasActiveSubscription,
    hasPremiumFeatures,
    hasEnterpriseFeatures,
    getCurrentPlan,
    showPaymentModal,
    cancelSubscription,
    loadSubscriptionStatus
  } = usePaymentStore();

  const currentPlan = getCurrentPlan();

  useEffect(() => {
    if (user) {
      loadSubscriptionStatus(user.userId);
    }
  }, [user, loadSubscriptionStatus]);

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'basic':
        return <Star className="w-5 h-5 text-blue-600" />;
      case 'premium':
        return <Zap className="w-5 h-5 text-purple-600" />;
      case 'enterprise':
        return <Crown className="w-5 h-5 text-yellow-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      canceled: { color: 'bg-red-100 text-red-800', text: 'Canceled' },
      past_due: { color: 'bg-yellow-100 text-yellow-800', text: 'Past Due' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' }
    };

    const badge = badges[status] || badges.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      await cancelSubscription(user?.userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
          {!hasActiveSubscription() && (
            <Link to="/pricing">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Upgrade Plan
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {hasActiveSubscription() && currentPlan ? (
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getPlanIcon(currentPlan.id)}
                <div>
                  <h4 className="font-medium text-gray-900">{currentPlan.name}</h4>
                  <p className="text-sm text-gray-600">${currentPlan.price}/{currentPlan.interval}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(subscriptionStatus)}
              </div>
            </div>

            {/* Subscription Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div className="text-sm text-gray-500">Next Billing</div>
                <div className="font-medium text-gray-900">
                  {currentSubscription?.nextBillingDate ? 
                    new Date(currentSubscription.nextBillingDate).toLocaleDateString() : 
                    'N/A'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Payment Method</div>
                <div className="font-medium text-gray-900 capitalize">
                  {currentSubscription?.method === 'base-x402' ? 'Base X402' : 'Credit Card'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Started</div>
                <div className="font-medium text-gray-900">
                  {currentSubscription?.startDate ? 
                    new Date(currentSubscription.startDate).toLocaleDateString() : 
                    'N/A'
                  }
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-2">Included Features</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {currentPlan.features.length > 4 && (
                <div className="text-sm text-gray-500 mt-2">
                  +{currentPlan.features.length - 4} more features
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Link to="/pricing">
                <Button variant="secondary" size="sm">
                  Change Plan
                </Button>
              </Link>
              {subscriptionStatus === 'active' && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleCancelSubscription}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
            <p className="text-gray-600 mb-4">
              Upgrade to access premium features like AI-powered nudges, advanced analytics, and unlimited support circles.
            </p>
            <Link to="/pricing">
              <Button className="bg-purple-600 hover:bg-purple-700">
                View Plans
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Feature Access Status */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Access</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Basic Features</span>
            </div>
            <span className="text-sm text-green-600">Included</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {hasPremiumFeatures() ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-gray-700">Premium Features</span>
            </div>
            <span className={`text-sm ${hasPremiumFeatures() ? 'text-green-600' : 'text-yellow-600'}`}>
              {hasPremiumFeatures() ? 'Active' : 'Upgrade Required'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {hasEnterpriseFeatures() ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-gray-700">Enterprise Features</span>
            </div>
            <span className={`text-sm ${hasEnterpriseFeatures() ? 'text-green-600' : 'text-yellow-600'}`}>
              {hasEnterpriseFeatures() ? 'Active' : 'Upgrade Required'}
            </span>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {payment.planId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {payment.method === 'base-x402' ? 'Base X402' : 'Credit Card'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}