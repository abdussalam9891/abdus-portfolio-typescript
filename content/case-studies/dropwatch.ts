import type { CaseStudy } from "./types";

export const dropwatch: CaseStudy = {
  slug: "dropwatch",
  clientName: "DropWatch",
  category: "Product / Solo Build",
  oneLiner:
    "A solo-built price-tracking product — scraping, alerts, and charts, shipped end to end.",
  problem:
    "Wanted to build and ship a full end-to-end product solo — price tracking for online products, notifying users when prices drop.",
  approach:
    "Built with Next.js App Router and TypeScript, Firecrawl for scraping target product pages, Supabase for auth, database, and scheduled jobs (pg_cron), Resend for email alerts, and Recharts for price history visualization.",
  techStack: [
    "Next.js",
    "TypeScript",
    "Supabase",
    "Firecrawl",
    "Resend",
    "Recharts",
    "Tailwind CSS",
    "shadcn/ui",
  ],
  outcome: "Live and functional at get-dropwatch.vercel.app.",
  images: [
    {
      src: "/images/work/dropwatch/home.webp",
      alt: "DropWatch homepage with the product URL tracker and tracked products list",
    },
    {
      src: "/images/work/dropwatch/price-history.webp",
      alt: "DropWatch price history chart for a tracked product",
    },
  ],
  liveUrl: "https://get-dropwatch.vercel.app",
  featured: true,
};
