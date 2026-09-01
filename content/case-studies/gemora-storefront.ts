import type { CaseStudy } from "./types";

export const gemoraStorefront: CaseStudy = {
  slug: "gemora-storefront",
  clientName: "Gemora — Storefront",
  category: "E-commerce / Customer-Facing",
  oneLiner:
    "A full jewelry e-commerce storefront — auth, cart, wishlist, and checkout — built from scratch.",
  problem:
    "Needed a full jewelry e-commerce storefront — browsing, cart, wishlist, checkout, auth — built and owned end to end.",
  approach:
    "Built the customer-facing storefront with vanilla HTML, Tailwind CSS, and JavaScript. Implemented multi-method auth (Google OAuth, email OTP, phone OTP), wishlist and cart (including atomic move-from-wishlist), a product catalog with filtering and pagination, and a full CMS module (announcement bar, static pages, homepage hero banners, site settings).",
  techStack: ["JavaScript", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
  outcome: "Live storefront in production.",
  images: [],
  featured: true,
};
