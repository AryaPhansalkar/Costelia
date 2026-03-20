'use client';

import { useState } from 'react';
import { ComparisonDashboard } from '@/components/dashboard/ComparisonDashboard';
import { Cloud, Database, HardDrive, Cpu } from 'lucide-react';

export default function Home() {
  const [selectedService, setSelectedService] = useState<'compute' | 'storage' | 'database'>('compute');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Cloud className="h-8 w-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Costelia</h1>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Real-time pricing comparison across AWS, Azure, and GCP
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex space-x-2 border-b border-slate-200">
            <button
              onClick={() => setSelectedService('compute')}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                selectedService === 'compute'
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Cpu className="h-5 w-5" />
              <span>Compute</span>
            </button>
            <button
              onClick={() => setSelectedService('storage')}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                selectedService === 'storage'
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <HardDrive className="h-5 w-5" />
              <span>Storage</span>
            </button>
            <button
              onClick={() => setSelectedService('database')}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                selectedService === 'database'
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Database className="h-5 w-5" />
              <span>Database</span>
            </button>
          </div>
        </div>

        <ComparisonDashboard serviceType={selectedService} />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">About</h4>
              <p className="text-sm text-slate-600">
                Compare real-time pricing for cloud services across AWS, Azure, and GCP to make informed decisions for your infrastructure.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Compute Instances</li>
                <li>Object Storage</li>
                <li>Managed Databases</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Cost Calculator</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            Cloud Cost Comparison Dashboard - Pricing data is for reference purposes only
          </div>
        </div>
      </footer>
    </div>
  );
}
