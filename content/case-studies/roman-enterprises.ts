import type { CaseStudy } from "./types";

export const romanEnterprises: CaseStudy = {
  slug: "roman-enterprises",
  clientName: "Roman Enterprises",
  category: "B2B / Industrial Manufacturing",
  oneLiner:
    "A multi-page site — plus a full 'Academy' knowledge hub — for a 30-year leather finishing products company.",
  problem:
    "A New Delhi-based leather edge-finishing products company (edge paint, filler/primer, finishing cream — 30+ years in the industry) needed a site that could speak credibly to both individual craftspeople and industrial manufacturers evaluating their products.",
  approach:
    "Built a multi-page site with dedicated product pages, an applications section (bags, wallets, belts, briefcases, industrial manufacturing), a process breakdown covering their 5-stage finishing process, and an \"Academy\" educational content section — positioning the client as a knowledge authority, not just a supplier.",
  techStack: ["Next.js", "Tailwind CSS"],
  outcome:
    "Live at their production domain, serving both retail craftspeople and manufacturing clients.",
  images: [
    {
      src: "/images/work/roman-enterprises/hero.webp",
      alt: "Roman Enterprises homepage showing the leather edge finishing hero section",
    },
  ],
  featured: true,
};
