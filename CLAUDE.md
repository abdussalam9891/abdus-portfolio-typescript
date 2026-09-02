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
- **Dark theme only.** No light palette, no theme toggle, no `prefers-color-scheme` switching. The motion work (entry sequence, blob glows, border beams) is drawn for a dark ground and the light version was visibly weaker; since the OS preference decided the default, a majority of first-time visitors were landing on the worse-looking theme. Colours live as CSS vars on `:root` in `app/globals.css` — retune them there, and keep components reading `--background`/`--foreground` rather than hard-coding colours.

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

## Background audio

The site plays a looping ambient track (`components/ui/AmbientAudio.tsx`, mounted in the root layout so it survives client-side navigation). Same trade-off as the animation: the client wants the saloon.wtf feel, so the guardrails are what make it survivable.

1. **Never autoplay on mount.** Browsers block audible autoplay anyway; playback is armed on the visitor's first pointer/key event. Do not try to route around this with muted-autoplay-then-unmute tricks.
2. **On by default, off in one click.** Every new visit comes up with sound armed; the toggle is reachable from every page. A mute is remembered in `sessionStorage`, so it holds for the rest of that visit (not just that page) but does not silence the site forever — deliberately, since music is part of the intended first impression. Do not move this to `localStorage` without revisiting that call.
3. **There are three states, not two.** `pending` (armed, browser hasn't allowed sound yet), `playing`, `paused`. Before the first gesture the control must not claim to be "off" — it isn't, it's waiting. Read the mute preference through `useSyncExternalStore` (as `lib/reduced-motion.ts` does), not a `setState` inside an effect; the lint rule `react-hooks/set-state-in-effect` will reject the latter.
4. **The audio file is never committed.** It streams from `NEXT_PUBLIC_AMBIENT_AUDIO_URL` (Vercel Blob / Cloudinary / Supabase Storage). With the var unset the component renders nothing — a fresh clone runs silent, not broken.
5. **Licensed audio only.** Royalty-free or Abdus's own. Do not add a track ripped from Spotify/YouTube/Apple Music, and do not build a player around a streaming service's content: the Spotify Web Playback SDK needs every *visitor* to log in with Premium, and Spotify embeds only give logged-out visitors a ~30s preview they must start themselves.
6. **It stays off the critical path.** The `<audio>` element is created lazily on that first gesture, so a Lighthouse run never fetches it and the homepage perf budget above is unaffected.

## Coding conventions

- Components are function components, named exports, colocated types
- No `any` — this is TypeScript strict mode, treat type errors as build blockers, not warnings to suppress
- Motion variants live in `/lib/motion.ts` and are imported, never redefined inline per component
- Each case study page must render correctly with zero motion (reduced-motion path) — if it doesn't make sense with animation stripped, the content structure is wrong, fix the structure not the animation

## Commands

- `npm run dev` — local dev
- `npm run build` — production build, must pass with zero TS errors before considering a phase "done"
- `npm run lint` — must pass before considering a phase "done"

## What NOT to do

- Don't add a custom domain config — subdomain deploy only, per client decision
- Don't reintroduce a light theme, a `ThemeToggle`, or `dark:` Tailwind variants — the site is dark-only (see tech stack). There is deliberately no `lib/theme.ts` and no pre-paint theme script.
- Don't add Gemora as internal/company-branded — Abdus has direct permission from his employer to show it; treat it as a normal case study, not a special/sensitive one
- Don't invent client testimonials, logos, or metrics not provided in `/content`
- Don't reach for Three.js/WebGL even if it would look cool — out of scope, agreed with client
- Don't commit an audio file to `/public`, or add music sourced from a streaming service — see "Background audio"
- Don't let the entry sequence become a second contact-info gate — contact (WhatsApp/phone/email) must be reachable within one click from any page, animation or not
