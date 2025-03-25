'use client';

import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Smart Home</span>
            <span className="block text-blue-600">Inventory Management</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your home inventory with smart receipt scanning, automated tracking, and intelligent insights.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href={session ? '/dashboard' : '/api/auth/signin'}
                className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => isLoading && e.preventDefault()}
              >
                {isLoading ? 'Loading...' : session ? 'Go to Dashboard' : 'Get Started'}
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#features"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        <div id="features" className="mt-24">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Smart Receipt Scanning</h3>
              <p className="mt-2 text-gray-600">Instantly digitize and categorize your receipts with our advanced OCR technology.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Inventory Intelligence</h3>
              <p className="mt-2 text-gray-600">Track your home inventory with smart expiration alerts and usage predictions.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Analytics & Insights</h3>
              <p className="mt-2 text-gray-600">Gain valuable insights into your spending patterns and inventory management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 