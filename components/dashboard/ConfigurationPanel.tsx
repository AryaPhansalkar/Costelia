'use client';

import { Settings } from 'lucide-react';

interface ConfigurationPanelProps {
  serviceType: 'compute' | 'storage' | 'database';
  config: {
    region: string;
    instanceType: string;
    storageSize: number;
    databaseType: string;
  };
  onChange: (config: any) => void;
}

export function ConfigurationPanel({ serviceType, config, onChange }: ConfigurationPanelProps) {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Region
          </label>
          <select
            value={config.region}
            onChange={(e) => updateConfig('region', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          >
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-1">EU (Ireland)</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
          </select>
        </div>

        {serviceType === 'compute' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Instance Type
            </label>
            <select
              value={config.instanceType}
              onChange={(e) => updateConfig('instanceType', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            >
              <option value="t3.small">Small (2 vCPU, 2 GB RAM)</option>
              <option value="t3.medium">Medium (2 vCPU, 4 GB RAM)</option>
              <option value="t3.large">Large (2 vCPU, 8 GB RAM)</option>
              <option value="m5.xlarge">XLarge (4 vCPU, 16 GB RAM)</option>
            </select>
          </div>
        )}

        {serviceType === 'storage' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Storage Size (GB)
            </label>
            <input
              type="number"
              value={config.storageSize}
              onChange={(e) => updateConfig('storageSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              min="1"
              max="10000"
            />
          </div>
        )}

        {serviceType === 'database' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Database Type
            </label>
            <select
              value={config.databaseType}
              onChange={(e) => updateConfig('databaseType', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="redis">Redis</option>
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={() => onChange(config)}
            className="w-full px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
          >
            Compare Prices
          </button>
        </div>
      </div>
    </div>
  );
}
