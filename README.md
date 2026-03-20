# Cloud Cost Comparison Dashboard

A professional dashboard for comparing cloud service pricing across AWS, Azure, and GCP in real-time.

## Features

- **Real-time Price Comparison**: Compare prices for Compute, Storage, and Database services across three major cloud providers
- **Interactive Configuration**: Customize instance types, storage sizes, regions, and database types
- **Best Value Highlighting**: Automatically identifies and highlights the most cost-effective option
- **Clean Professional UI**: Business-focused design with clear data visualization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Services Covered

### Compute
- AWS EC2
- Azure Virtual Machines
- GCP Compute Engine

### Storage
- AWS S3
- Azure Blob Storage
- GCP Cloud Storage

### Database
- AWS RDS / DocumentDB / ElastiCache
- Azure Database / Cosmos DB / Azure Cache
- GCP Cloud SQL / Firestore / Memorystore

## Technology Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Next.js API Routes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout
│   └── api/
│       └── pricing/
│           └── route.ts      # Pricing API endpoint
├── components/
│   └── dashboard/
│       ├── ComparisonDashboard.tsx    # Main comparison component
│       ├── PriceCard.tsx              # Individual provider pricing card
│       └── ConfigurationPanel.tsx     # Configuration form
└── lib/
    └── types.ts              # TypeScript type definitions
```

## API Usage

The pricing API accepts the following parameters:

- `serviceType`: compute | storage | database
- `region`: us-east-1 | us-west-2 | eu-west-1 | ap-southeast-1
- `instanceType`: t3.small | t3.medium | t3.large | m5.xlarge
- `storageSize`: Size in GB (for storage services)
- `databaseType`: mysql | postgresql | mongodb | redis

Example:
```
GET /api/pricing?serviceType=compute&region=us-east-1&instanceType=t3.medium
```

## Future Enhancements

- Integration with actual cloud provider APIs
- Historical price tracking
- Cost optimization recommendations
- Export pricing reports
- Multi-region comparison
- Custom instance configurations
