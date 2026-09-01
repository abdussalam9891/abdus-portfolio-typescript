import type { CaseStudy } from "./types";

export const gemoraDashboard: CaseStudy = {
  slug: "gemora-dashboard",
  clientName: "Gemora — Admin Dashboard",
  category: "Internal Tooling / Admin",
  oneLiner:
    "The admin system behind Gemora — RBAC, payments, and CMS tooling for order and content management.",
  problem:
    "The storefront needed a companion admin system for managing products, orders, coupons, and content — with proper role-based access control.",
  approach:
    "Built the admin dashboard with React 19, Vite, Tailwind CSS v4, and shadcn/ui. Implemented RBAC across all admin routes, Razorpay payment integration with signature verification, and the backend CMS management tools the storefront depends on.",
  techStack: [
    "React 19",
    "Vite",
    "Tailwind CSS v4",
    "shadcn/ui",
    "Node.js",
    "Express",
    "MongoDB",
  ],
  outcome: "Live and in active use for order and content management.",
  images: [],
  featured: true,
};
