import { NextRequest, NextResponse } from 'next/server';

interface PricingResponse {
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serviceType = searchParams.get('serviceType') || 'compute';
  const region = searchParams.get('region') || 'us-east-1';
  const instanceType = searchParams.get('instanceType') || 't3.medium';
  const storageSize = parseInt(searchParams.get('storageSize') || '100');
  const databaseType = searchParams.get('databaseType') || 'mysql';

  let pricingData: PricingResponse;

  switch (serviceType) {
    case 'compute':
      pricingData = getComputePricing(instanceType, region);
      break;
    case 'storage':
      pricingData = getStoragePricing(storageSize, region);
      break;
    case 'database':
      pricingData = getDatabasePricing(databaseType, region);
      break;
    default:
      pricingData = getComputePricing(instanceType, region);
  }

  return NextResponse.json(pricingData);
}

function getComputePricing(instanceType: string, region: string): PricingResponse {
  const basePrices: Record<string, { aws: number; azure: number; gcp: number }> = {
    't3.small': { aws: 0.0208, azure: 0.0228, gcp: 0.0190 },
    't3.medium': { aws: 0.0416, azure: 0.0456, gcp: 0.0380 },
    't3.large': { aws: 0.0832, azure: 0.0912, gcp: 0.0760 },
    'm5.xlarge': { aws: 0.192, azure: 0.210, gcp: 0.185 },
  };

  const regionMultiplier = region.startsWith('us') ? 1.0 : 1.15;
  const prices = basePrices[instanceType] || basePrices['t3.medium'];

  return {
    aws: {
      price: prices.aws * regionMultiplier,
      unit: 'hour',
      details: `EC2 ${instanceType} instance in ${region}. On-demand pricing with no upfront commitment.`,
    },
    azure: {
      price: prices.azure * regionMultiplier,
      unit: 'hour',
      details: `Virtual Machine equivalent to ${instanceType} in ${region}. Pay-as-you-go pricing.`,
    },
    gcp: {
      price: prices.gcp * regionMultiplier,
      unit: 'hour',
      details: `Compute Engine instance comparable to ${instanceType} in ${region}. Standard pricing.`,
    },
  };
}

function getStoragePricing(storageSize: number, region: string): PricingResponse {
  const pricePerGB = {
    aws: 0.023,
    azure: 0.0255,
    gcp: 0.020,
  };

  const regionMultiplier = region.startsWith('us') ? 1.0 : 1.12;

  return {
    aws: {
      price: storageSize * pricePerGB.aws * regionMultiplier,
      unit: 'month',
      details: `S3 Standard storage for ${storageSize}GB in ${region}. Includes 11 9's durability.`,
    },
    azure: {
      price: storageSize * pricePerGB.azure * regionMultiplier,
      unit: 'month',
      details: `Blob Storage (Hot tier) for ${storageSize}GB in ${region}. Locally redundant storage.`,
    },
    gcp: {
      price: storageSize * pricePerGB.gcp * regionMultiplier,
      unit: 'month',
      details: `Cloud Storage Standard for ${storageSize}GB in ${region}. Regional storage class.`,
    },
  };
}

function getDatabasePricing(databaseType: string, region: string): PricingResponse {
  const basePrices: Record<string, { aws: number; azure: number; gcp: number }> = {
    mysql: { aws: 0.017, azure: 0.019, gcp: 0.0150 },
    postgresql: { aws: 0.018, azure: 0.020, gcp: 0.0165 },
    mongodb: { aws: 0.057, azure: 0.062, gcp: 0.054 },
    redis: { aws: 0.034, azure: 0.037, gcp: 0.032 },
  };

  const regionMultiplier = region.startsWith('us') ? 1.0 : 1.18;
  const prices = basePrices[databaseType] || basePrices['mysql'];

  const dbNames = {
    mysql: { aws: 'RDS MySQL', azure: 'Azure Database for MySQL', gcp: 'Cloud SQL MySQL' },
    postgresql: { aws: 'RDS PostgreSQL', azure: 'Azure Database for PostgreSQL', gcp: 'Cloud SQL PostgreSQL' },
    mongodb: { aws: 'DocumentDB', azure: 'Cosmos DB', gcp: 'Firestore' },
    redis: { aws: 'ElastiCache Redis', azure: 'Azure Cache for Redis', gcp: 'Memorystore Redis' },
  };

  const names = dbNames[databaseType as keyof typeof dbNames] || dbNames.mysql;

  return {
    aws: {
      price: prices.aws * regionMultiplier,
      unit: 'hour',
      details: `${names.aws} db.t3.small instance in ${region}. General purpose SSD storage.`,
    },
    azure: {
      price: prices.azure * regionMultiplier,
      unit: 'hour',
      details: `${names.azure} Basic tier 1 vCore in ${region}. 5GB storage included.`,
    },
    gcp: {
      price: prices.gcp * regionMultiplier,
      unit: 'hour',
      details: `${names.gcp} db-f1-micro instance in ${region}. 10GB SSD storage.`,
    },
  };
}
