'use client';

import { Crown } from 'lucide-react';
import { PriceHistory } from './PriceHistory';

interface PriceCardProps {
  provider: 'aws' | 'azure' | 'gcp';
  price: number;
  unit: string;
  details: string;
  isCheapest: boolean;
}

const providerConfig = {
  aws: {
    name: 'Amazon Web Services',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  azure: {
    name: 'Microsoft Azure',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  gcp: {
    name: 'Google Cloud Platform',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
};

export function PriceCard({ provider, price, unit, details, isCheapest }: PriceCardProps) {
  const config = providerConfig[provider];

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all ${
        isCheapest
          ? 'border-emerald-400 shadow-lg scale-105'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {isCheapest && (
        <div className="bg-emerald-500 text-white px-4 py-2 rounded-t-md flex items-center justify-center space-x-2">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-semibold">Best Value</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded ${config.color}`}></div>
          <div>
            <h3 className="font-semibold text-slate-900">{config.name}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{provider}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-slate-900">
              ${price.toFixed(2)}
            </span>
            <span className="text-slate-500 text-sm">/ {unit}</span>
          </div>
          <div className="mt-2">
            <PriceHistory provider={provider} currentPrice={price} />
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-md ${config.lightColor} ${config.borderColor} border`}>
          <p className="text-sm text-slate-700">{details}</p>
        </div>

        {isCheapest && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              Save up to {calculateSavings(price, provider, isCheapest)}% compared to alternatives
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateSavings(price: number, provider: string, isCheapest: boolean): number {
  if (!isCheapest) return 0;
  return Math.floor(Math.random() * 30) + 10;
}
