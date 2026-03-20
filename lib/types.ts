export interface PricingData {
  aws: ProviderPricing;
  azure: ProviderPricing;
  gcp: ProviderPricing;
}

export interface ProviderPricing {
  price: number;
  unit: string;
  details: string;
}

export type CloudProvider = 'aws' | 'azure' | 'gcp';
export type ServiceType = 'compute' | 'storage' | 'database';

export interface ServiceConfig {
  region: string;
  instanceType: string;
  storageSize: number;
  databaseType: string;
}
