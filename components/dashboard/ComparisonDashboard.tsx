'use client';

import { useState, useEffect } from 'react';
import { PriceCard } from './PriceCard';
import { ConfigurationPanel } from './ConfigurationPanel';
import { ComparisonChart } from './ComparisonChart';
import { Loader as Loader2 } from 'lucide-react';

interface PricingData {
  aws: {
    price: number;
    unit: string;
    details: string;
  };
  azure: {
    price: number;
    unit: string;
    details: string;
  };
  gcp: {
    price: number;
    unit: string;
    details: string;
  };
}

interface ComparisonDashboardProps {
  serviceType: 'compute' | 'storage' | 'database';
}

export function ComparisonDashboard({ serviceType }: ComparisonDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [config, setConfig] = useState({
    region: 'us-east-1',
    instanceType: 't3.medium',
    storageSize: 100,
    databaseType: 'mysql',
  });

  useEffect(() => {
    fetchPricing();
  }, [serviceType, config]);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        serviceType,
        region: config.region,
        instanceType: config.instanceType,
        storageSize: config.storageSize.toString(),
        databaseType: config.databaseType,
      });

      const response = await fetch(`/api/pricing?${params}`);
      const data = await response.json();
      setPricingData(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const findCheapest = () => {
    if (!pricingData) return null;
    const prices = [
      { provider: 'aws', price: pricingData.aws.price },
      { provider: 'azure', price: pricingData.azure.price },
      { provider: 'gcp', price: pricingData.gcp.price },
    ];
    return prices.reduce((min, current) =>
      current.price < min.price ? current : min
    ).provider;
  };

  const cheapest = findCheapest();

  return (
    <div className="space-y-6">
      <ConfigurationPanel
        serviceType={serviceType}
        config={config}
        onChange={setConfig}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : pricingData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PriceCard
              provider="aws"
              price={pricingData.aws.price}
              unit={pricingData.aws.unit}
              details={pricingData.aws.details}
              isCheapest={cheapest === 'aws'}
            />
            <PriceCard
              provider="azure"
              price={pricingData.azure.price}
              unit={pricingData.azure.unit}
              details={pricingData.azure.details}
              isCheapest={cheapest === 'azure'}
            />
            <PriceCard
              provider="gcp"
              price={pricingData.gcp.price}
              unit={pricingData.gcp.unit}
              details={pricingData.gcp.details}
              isCheapest={cheapest === 'gcp'}
            />
          </div>

          <ComparisonChart
            awsPrice={pricingData.aws.price}
            azurePrice={pricingData.azure.price}
            gcpPrice={pricingData.gcp.price}
            unit={pricingData.aws.unit}
          />
        </>
      ) : (
        <div className="text-center py-20 text-slate-500">
          No pricing data available
        </div>
      )}
    </div>
  );
}
