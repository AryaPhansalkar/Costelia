import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cloud Cost Comparison - AWS vs Azure vs GCP',
  description: 'Real-time pricing comparison for compute, storage, and database services across AWS, Azure, and GCP. Find the most cost-effective cloud solution for your needs.',
  metadataBase: new URL('https://cloud-cost-comparison.netlify.app'),
  openGraph: {
    title: 'Cloud Cost Comparison Dashboard',
    description: 'Compare cloud service pricing across AWS, Azure, and GCP',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Cost Comparison Dashboard',
    description: 'Compare cloud service pricing across AWS, Azure, and GCP',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
