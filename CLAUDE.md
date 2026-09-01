# CLAUDE.md — Abdus Salam Portfolio v2

This file is project memory for Claude Code. Read this before making changes. Keep it updated as decisions change — don't let it go stale.

## What this project is

A personal portfolio site for Abdus Salam, a full-stack developer based in New Delhi, India, working a full-time remote dev job while freelancing on the side. The site has **two audiences simultaneously**: freelance clients deciding whether to hire him for a project, and potential employers evaluating him for a role. It must work for both without feeling schizophrenic — case studies do the work for the freelance audience, the About page and skills section do the work for the employer audience.

Visual direction is **deliberately animation-heavy**, closer to award-site territory (reference: naveengumaste.me) than a conservative business template. This was a conscious trade-off the client accepted: motion and craft over maximum conversion-safety. See "Animation philosophy" below for the guardrails that make this trade-off survivable instead of reckless.

## Tech stack (non-negotiable)

- Next.js 14+, App Router, TypeScript strict mode
- Tailwind CSS
- Framer Motion — scroll-triggered reveals, page transitions, hover/micro-interactions
- GSAP + ScrollTrigger — the scripted entry sequence only (Framer Motion for everything else; don't mix animation libraries for the same job)
- Deployed to Vercel, subdomain only, no custom domain (`*.vercel.app`)
- No Three.js / WebGL / 3D — explicitly out of scope. The brief is "heavy 2D motion," not a 3D world.

## Folder structure

```
/app
  /(site)
    /page.tsx                 → Home
    /work
      /page.tsx                → Case study grid (all 6)
      /[slug]/page.tsx          → Individual case study detail
    /about/page.tsx
    /contact/page.tsx
    /layout.tsx                 → Root layout, entry animation mount point
/components
  /entry
    EntrySequence.tsx           → GSAP scripted intro, session-first-load only
  /ui                            → Buttons, badges, nav, generic primitives
  /sections
    Hero.tsx
    WorkGrid.tsx
    WorkCard.tsx
    AboutTeaser.tsx
    ContactBlock.tsx
  /case-study
    CaseStudyHero.tsx
    CaseStudyContent.tsx
    CaseStudyGallery.tsx
/content
  /case-studies
    reisagri.ts
    roman-enterprises.ts
    bharatbhramana.ts
    dropwatch.ts
    gemora-storefront.ts
    gemora-dashboard.ts
  /case-studies/index.ts        → exports typed array, single source of truth for /work grid + detail pages
/lib
  motion.ts                     → shared Framer Motion variants (fadeUp, stagger, etc.) — define once, reuse everywhere, don't hand-roll variants per component
  reduced-motion.ts              → hook wrapping prefers-reduced-motion, used by EntrySequence and any GSAP timeline
/public
  /images/work/{slug}/...        → screenshots per case study, optimized (see perf budget)
```

## Content data shape

Every case study is a typed object, not scattered JSX. Define once in `/content/case-studies/*.ts`:

```ts
export interface CaseStudy {
  slug: string;
  clientName: string;
  category: string;          // e.g. "B2B / Commodity Trading"
  oneLiner: string;          // shown on the grid card
  problem: string;           // what the client needed, 2-4 sentences
  approach: string;          // what Abdus actually built/decided, 2-4 sentences
  techStack: string[];
  outcome: string;           // status/result — live traffic, delivered, client type
  images: { src: string; alt: string }[];
  liveUrl?: string;
  featured: boolean;         // controls home page condensed grid
}
```

Do not invent metrics (traffic numbers, conversion rates) that weren't provided. If a number isn't known, describe outcome qualitatively ("live and in active use by the client's customers") rather than fabricating a stat — a client who asks about it in a call and gets a different answer than the site claims is worse than no stat at all.

## Animation philosophy (read this before writing any GSAP)

The client explicitly chose heavy animation knowing the trust/performance trade-off. That decision is final — don't re-litigate it in code. But "heavy" has rules:

1. **Entry sequence runs once per session, not per navigation.** Use `sessionStorage` to gate it — first visit gets the full intro, every subsequent page view/internal nav does not replay it. A client re-opening the link mid-call must not sit through it twice.
2. **The entry sequence must be skippable** — a visible "Skip" affordance or a tap-anywhere-to-skip, from the first frame.
3. **`prefers-reduced-motion` is mandatory, not optional.** Every GSAP timeline and every Framer Motion variant checks this and substitutes an instant/near-instant transition when it's set. This is an accessibility requirement, not a style choice — do not skip it to save time.
4. **Performance budget:** Lighthouse mobile performance score ≥ 80 on the homepage, even with the entry sequence. Use `next/image` for every image, lazy-load below-the-fold sections, and keep the entry sequence's asset weight under ~500KB. If a design idea can't hit this budget, simplify the idea — don't blow the budget.
5. **Case study detail pages get lighter treatment than the homepage.** A client re-reading a case study to make a decision should not be fighting animation to read text. Scroll reveals on section-enter are fine; don't animate body copy itself.
