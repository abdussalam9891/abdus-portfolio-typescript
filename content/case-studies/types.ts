export interface CaseStudy {
  slug: string;
  clientName: string;
  category: string; // e.g. "B2B / Commodity Trading"
  oneLiner: string; // shown on the grid card
  problem: string; // what the client needed, 2-4 sentences
  approach: string; // what Abdus actually built/decided, 2-4 sentences
  techStack: string[];
  outcome: string; // status/result — live traffic, delivered, client type
  images: { src: string; alt: string }[];
  liveUrl?: string;
  /**
   * Caveat shown alongside the live link — a feature that's currently paused,
   * a known limitation. Keep it to one sentence; it renders on cards too.
   */
  liveNote?: string;
  /** Read-only demo account for a live site that sits behind a login. */
  demoCredentials?: { email: string; password: string };
  featured: boolean; // controls home page condensed grid
}
