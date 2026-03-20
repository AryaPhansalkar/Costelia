import { google } from "googleapis";


function mapToGCPRegion(region: string) {
  const map: Record<string, string> = {
    "us-east-1": "us-east1",
    "us-west-1": "us-west1",
    "eu-west-1": "europe-west1",
    "ap-south-1": "asia-south1",
  };

  return map[region] || "us-central1";
}

export async function getGCPComputePrice(instanceType: string, region: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const authClient = await auth.getClient();

    const cloudbilling = google.cloudbilling({
  version: "v1",
  auth: authClient as any,
});

    const response = await cloudbilling.services.skus.list({
      parent: "services/6F81-5844-456A",
    });

    const skus = response.data.skus || [];

    // ✅ FIX 1: map region
    const gcpRegion = mapToGCPRegion(region);

    // ✅ FIX 3: debug logs
    console.log("Total SKUs:", skus.length);
    console.log("First SKU:", skus[0]);

    // ✅ FIX 2: better matching
    const matched = skus.find((sku: any) =>
  sku.category?.resourceFamily === "Compute" &&
  sku.category?.resourceGroup === "CPU" && // ✅ CPU only
  sku.category?.usageType === "OnDemand" &&
  sku.serviceRegions?.includes(gcpRegion) &&
  !sku.description?.toLowerCase().includes("sole tenancy") && // ❌ remove bad SKUs
  !sku.description?.toLowerCase().includes("premium") // ❌ avoid weird pricing
);

    console.log("Matched SKU:", matched);

    if (!matched) return null;

    const priceInfo =
      matched.pricingInfo?.[0]?.pricingExpression?.tieredRates?.[0]?.unitPrice;

    if (!priceInfo) return null;

    const price =
      Number(priceInfo.units || 0) +
      Number(priceInfo.nanos || 0) / 1e9;

    return price;
  } catch (err) {
    console.error("GCP Pricing Error:", err);
    return null;
  }
}