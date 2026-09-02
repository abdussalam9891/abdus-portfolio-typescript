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
  images: [
    {
      src: "/images/work/gemora-dashboard/dark.webp",
      alt: "Gemora admin dashboard revenue chart and recent orders in dark mode",
    },
    {
      src: "/images/work/gemora-dashboard/light.webp",
      alt: "Gemora admin dashboard revenue chart and recent orders in light mode",
    },
  ],
  liveUrl: "https://jwelry-admin-dashboard.vercel.app/login",
  liveNote: "The dashboard sits behind RBAC — sign in with the demo account below.",
  demoCredentials: {
    email: "demo.gemora@example.com",
    password: "demo@9891",
  },
  featured: true,
};
