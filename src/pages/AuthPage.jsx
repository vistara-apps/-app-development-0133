import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuthStore } from '../stores/authStore'
import { Heart, Brain, Target, TrendingUp } from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo login - in real app would validate credentials
    login({
      userId: 'demo-user-1',
      email,
      username: email.split('@')[0],
      onboardingCompleted: true,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    })
  }

  const features = [
    {
      icon: Heart,
      title: 'Daily Check-ins',
      description: 'Track your emotional state with gentle, automated prompts'
    },
    {
      icon: Brain,
      title: 'Guided Activities',
      description: 'Build resilience with mindfulness, gratitude, and cognitive exercises'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your emotional journey with beautiful charts and insights'
    },
    {
      icon: Target,
      title: 'AI Insights',
      description: 'Get personalized recommendations based on your patterns'
    }
  ]

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-text-primary mb-4">
              ResilientFlow
            </h1>
            <p className="text-xl text-text-secondary">
              Build daily emotional resilience, track your progress, with AI insights.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card className="p-8 max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-text-secondary">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button type="submit" className="w-full">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Demo access */}
          <div className="mt-4 p-3 bg-accent/10 rounded-lg text-center">
            <p className="text-sm text-text-secondary">
              Demo access: Use any email/password to try the app
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}