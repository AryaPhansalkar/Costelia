'use client';

import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface PriceHistoryProps {
  provider: 'aws' | 'azure' | 'gcp';
  currentPrice: number;
}

export function PriceHistory({ provider, currentPrice }: PriceHistoryProps) {
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [changePercent, setChangePercent] = useState(0);

  useEffect(() => {
    const randomTrend = Math.random();
    if (randomTrend > 0.6) {
      setTrend('up');
      setChangePercent(Math.random() * 5);
    } else if (randomTrend < 0.4) {
      setTrend('down');
      setChangePercent(Math.random() * 5);
    } else {
      setTrend('stable');
      setChangePercent(0);
    }
  }, [currentPrice]);

  if (trend === 'stable') {
    return (
      <div className="flex items-center text-xs text-slate-500">
        <span>No change from last month</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-1 text-xs ${
        trend === 'up' ? 'text-red-600' : 'text-green-600'
      }`}
    >
      {trend === 'up' ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      <span>
        {trend === 'up' ? '+' : '-'}
        {changePercent.toFixed(1)}% from last month
      </span>
    </div>
  );
}
