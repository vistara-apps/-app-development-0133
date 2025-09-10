import React from 'react'
import { ServiceTester } from '../components/ServiceTester'

export function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceTester />
      </div>
    </div>
  )
}