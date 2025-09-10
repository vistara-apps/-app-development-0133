import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import SupabaseTest from '../services/testSupabase'
import AITest from '../services/testAI'
import { 
  CheckCircle, 
  XCircle, 
  Loader, 
  Database, 
  Brain, 
  CreditCard,
  Calendar,
  MessageSquare,
  Zap
} from 'lucide-react'

export function ServiceTester() {
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  const runTest = async (testName, testFunction) => {
    setIsRunning(true)
    try {
      console.log(`🧪 Running ${testName} test...`)
      const result = await testFunction()
      setTestResults(prev => ({
        ...prev,
        [testName]: result
      }))
      console.log(`${testName} result:`, result)
    } catch (error) {
      console.error(`${testName} error:`, error)
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})
    
    // Run Supabase tests
    await runTest('supabase', SupabaseTest.runAllTests)
    
    // Run AI tests
    await runTest('ai', AITest.runAllTests)
    
    setIsRunning(false)
  }

  const getStatusIcon = (result) => {
    if (!result) return <Loader className="w-4 h-4 animate-spin" />
    if (result.success) return <CheckCircle className="w-4 h-4 text-green-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  const getStatusText = (result) => {
    if (!result) return 'Not tested'
    if (result.success) return 'Success'
    return 'Failed'
  }

  const getStatusColor = (result) => {
    if (!result) return 'text-gray-500'
    if (result.success) return 'text-green-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Service Tester
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test all your integrations and services
        </p>
      </div>

      {/* Test Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={runAllTests}
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => runTest('supabase', SupabaseTest.runAllTests)}
            disabled={isRunning}
            variant="outline"
          >
            <Database className="w-4 h-4 mr-2" />
            Test Supabase
          </Button>
          
          <Button 
            onClick={() => runTest('ai', AITest.runAllTests)}
            disabled={isRunning}
            variant="outline"
          >
            <Brain className="w-4 h-4 mr-2" />
            Test AI
          </Button>
        </div>
      </Card>

      {/* Test Results */}
      <div className="grid gap-6">
        {/* Supabase Test Results */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Supabase Database</h3>
            {getStatusIcon(testResults.supabase)}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Connection</span>
              <span className={`text-sm font-medium ${getStatusColor(testResults.supabase?.connection)}`}>
                {getStatusText(testResults.supabase?.connection)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tables</span>
              <span className={`text-sm font-medium ${getStatusColor(testResults.supabase?.tables)}`}>
                {getStatusText(testResults.supabase?.tables)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Authentication</span>
              <span className={`text-sm font-medium ${getStatusColor(testResults.supabase?.auth)}`}>
                {getStatusText(testResults.supabase?.auth)}
              </span>
            </div>
            
            {testResults.supabase?.error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {testResults.supabase.error}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* AI Test Results */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">AI Features</h3>
            {getStatusIcon(testResults.ai)}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">OpenAI Connection</span>
              <span className={`text-sm font-medium ${getStatusColor(testResults.ai?.connection)}`}>
                {getStatusText(testResults.ai?.connection)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Stress Analysis</span>
              <span className={`text-sm font-medium ${getStatusColor(testResults.ai?.stressAnalysis)}`}>
                {getStatusText(testResults.ai?.stressAnalysis)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Activity Recommendations</span>
              <span className={`text-sm font-medium ${getStatusColor(testResults.ai?.recommendations)}`}>
                {getStatusText(testResults.ai?.recommendations)}
              </span>
            </div>
            
            {testResults.ai?.error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {testResults.ai.error}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Integration Status */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Integrations</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Calendar Integration</span>
              <span className="text-sm font-medium text-yellow-600">Ready</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Slack Integration</span>
              <span className="text-sm font-medium text-yellow-600">Ready</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email Integration</span>
              <span className="text-sm font-medium text-yellow-600">Ready</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Environment Variables Check */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">OpenAI API Key</span>
            <span className={import.meta.env.VITE_OPENAI_API_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Supabase URL</span>
            <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Supabase Key</span>
            <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}