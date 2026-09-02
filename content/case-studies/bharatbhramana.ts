import type { CaseStudy } from "./types";

export const bharatbhramana: CaseStudy = {
  slug: "bharatbhramana",
  clientName: "BharatBhramana",
  category: "Consumer / Travel & Tourism",
  oneLiner:
    "A conversion-focused, WhatsApp-first booking site for a Jaipur tour operator.",
  problem:
    "A Jaipur-based private car-and-driver tour operator needed a booking-focused site to compete for customers researching India tour packages (Golden Triangle, Rajasthan, Kerala, Kashmir, Himachal, spiritual tours).",
  approach:
    "Built a conversion-focused multi-page site: package/destination pages, fleet/car pages, a trust-building \"why choose us\" section, FAQ, and testimonials, with WhatsApp as the primary conversion path throughout.",
  // TODO(abdus): tech stack unconfirmed — defaulted to match the other client sites, confirm or correct.
  techStack: ["Next.js", "Tailwind CSS"],
  outcome: "Live in production, handling real customer inquiries via WhatsApp.",
  images: [
    {
      src: "/images/work/bharatbhramana/hero.webp",
      alt: "BharatBhramana homepage showing the private car and driver booking hero section",
    },
  ],
  liveUrl: "https://bharat-bharman.vercel.app",
  featured: true,
};
