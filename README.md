# Abdus Salam — Portfolio

Personal portfolio site for Abdus Salam, a full-stack developer based in New Delhi, India. Built to serve two audiences at once: freelance clients evaluating case studies, and employers evaluating skills and experience.

## Stack

- Next.js (App Router, TypeScript strict mode)
- Tailwind CSS
- Framer Motion for scroll reveals, page transitions, and micro-interactions
- GSAP + ScrollTrigger for the scripted entry sequence

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (must pass with zero TS errors)
- `npm run lint` — lint check

## Background music

The site plays a looping ambient track (`components/ui/AmbientAudio.tsx`),
started on the visitor's first interaction and toggleable from the pill in the
bottom-left corner.

The audio is **streamed from a remote URL, not committed to this repo**. Set
`NEXT_PUBLIC_AMBIENT_AUDIO_URL` in `.env.local` (and in the Vercel project
settings) to a publicly readable file on Vercel Blob, Cloudinary, or Supabase
Storage. With the var unset the player renders nothing and the site runs
silent — nothing else breaks.

Track requirements:

- **Licensed.** Royalty-free (Uppbeat, Pixabay Music, CC0) or Abdus's own. Not
  ripped from a streaming service — this site is shown to clients and
  employers.
- **Small.** Under ~2 MB; 96–128 kbps mono is plenty for background ambience.
  It only loads after the first interaction, so it never affects the homepage
  Lighthouse run, but it still costs a real visitor bandwidth.
- **Seamlessly loopable.** It repeats indefinitely, so no audible seam at the
  wrap point.

## Project structure

See `CLAUDE.md` for the full folder layout, content data shape, and animation guidelines.

## Deployment

Deployed to Vercel on a `*.vercel.app` subdomain.
