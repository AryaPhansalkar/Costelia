'use client';

import { ChartBar as BarChart3 } from 'lucide-react';

interface ComparisonChartProps {
  awsPrice: number;
  azurePrice: number;
  gcpPrice: number;
  unit: string;
}

export function ComparisonChart({ awsPrice, azurePrice, gcpPrice, unit }: ComparisonChartProps) {
  const maxPrice = Math.max(awsPrice, azurePrice, gcpPrice);
  const getBarWidth = (price: number) => (price / maxPrice) * 100;

  const providers = [
    { name: 'AWS', price: awsPrice, color: 'bg-orange-500', lightColor: 'bg-orange-100' },
    { name: 'Azure', price: azurePrice, color: 'bg-blue-500', lightColor: 'bg-blue-100' },
    { name: 'GCP', price: gcpPrice, color: 'bg-green-500', lightColor: 'bg-green-100' },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-5 w-5 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-900">Price Comparison</h3>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">{provider.name}</span>
              <span className="text-sm font-mono font-semibold text-slate-900">
                ${provider.price.toFixed(2)} / {unit}
              </span>
            </div>
            <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${provider.color} rounded-full transition-all duration-500 flex items-center justify-end px-3`}
                style={{ width: `${getBarWidth(provider.price)}%` }}
              >
                {getBarWidth(provider.price) > 20 && (
                  <span className="text-xs font-semibold text-white">
                    {((provider.price / maxPrice) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              ${Math.min(awsPrice, azurePrice, gcpPrice).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Lowest Price</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              ${((awsPrice + azurePrice + gcpPrice) / 3).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Average Price</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              ${Math.max(awsPrice, azurePrice, gcpPrice).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Highest Price</div>
          </div>
        </div>
      </div>
    </div>
  );
}
