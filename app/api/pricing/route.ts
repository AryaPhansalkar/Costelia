import { NextRequest, NextResponse } from 'next/server';
import { getGCPComputePrice } from "@/lib/gcpPricing";

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
      pricingData = await getComputePricing(instanceType, region);
      break;
    case 'storage':
      pricingData = getStoragePricing(storageSize, region);
      break;
    case 'database':
      pricingData = getDatabasePricing(databaseType, region);
      break;
    default:
      pricingData = await getComputePricing(instanceType, region);
  }

  return NextResponse.json(pricingData);
}


async function getComputePricing(instanceType: string, region: string): Promise<PricingResponse> {
  const basePrices = {
    't3.small': { aws: 0.0208, azure: 0.0228 },
    't3.medium': { aws: 0.0416, azure: 0.0456 },
    't3.large': { aws: 0.0832, azure: 0.0912 },
    'm5.xlarge': { aws: 0.192, azure: 0.210 },
  };

  const regionMultiplier = region.startsWith('us') ? 1.0 : 1.15;
  const prices = basePrices[instanceType as keyof typeof basePrices] || basePrices['t3.medium'];

  // ✅ REAL GCP PRICE
  const gcpLivePrice = await getGCPComputePrice(instanceType, region);

  return {
    aws: {
      price: prices.aws * regionMultiplier,
      unit: 'hour',
      details: `EC2 ${instanceType} instance in ${region}`,
    },
    azure: {
      price: prices.azure * regionMultiplier,
      unit: 'hour',
      details: `Azure VM equivalent of ${instanceType} in ${region}`,
    },
    gcp: {
      price: (gcpLivePrice ?? -1) * regionMultiplier,
      unit: 'hour',
      details: `Live GCP pricing (from SKU API)`,
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
