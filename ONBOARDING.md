# ONBOARDING.md — for a developer new to TypeScript and Next.js

You know HTML, CSS and some JavaScript/React. You have not written TypeScript
or used the Next.js App Router before. This document teaches both **using this
repo's actual code as the examples**, so by the end you can read any file here
and know what you're looking at.

Read this once top to bottom. Then use `NOTES.md` as the map when you actually
go to change something.

**Contents**

1. [Get it running](#1-get-it-running)
2. [What TypeScript actually adds](#2-what-typescript-actually-adds)
3. [The TypeScript you need for this repo](#3-the-typescript-you-need-for-this-repo)
4. [Next.js: the file system is the router](#4-nextjs-the-file-system-is-the-router)
5. [Server Components vs Client Components](#5-server-components-vs-client-components)
6. [Data flow in this site](#6-data-flow-in-this-site)
7. [Tailwind v4 as used here](#7-tailwind-v4-as-used-here)
8. [React hooks you will meet in this repo](#8-react-hooks-you-will-meet-in-this-repo)
9. [Animation: Framer Motion and GSAP](#9-animation-framer-motion-and-gsap)
10. [Accessibility rules that are not optional here](#10-accessibility-rules-that-are-not-optional-here)
11. [Your first three tasks](#11-your-first-three-tasks)
12. [Debugging: common errors and what they mean](#12-debugging-common-errors-and-what-they-mean)
13. [Glossary](#13-glossary)

---

## 1. Get it running

```bash
npm install
npm run dev          # http://localhost:3000
```

Two environment variables live in a file called `.env.local` at the repo root.
It is **not** committed. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

- `RESEND_API_KEY` — without it the contact form returns a friendly 500. The
  rest of the site works fine.
- `NEXT_PUBLIC_AMBIENT_AUDIO_URL` — without it the music player renders
  nothing. The rest of the site works fine.

So a fresh clone with an empty `.env.local` runs. That's deliberate.

Before you say a piece of work is done, both of these must pass:

```bash
npm run build     # type errors are build failures, not warnings
npm run lint
```

---

## 2. What TypeScript actually adds

TypeScript is JavaScript plus **type annotations that are erased before the
code runs**. Nothing in a `.ts`/`.tsx` file reaches the browser as types. Their
only job is to make the compiler shout at you in your editor and during
`npm run build`.

```ts
// JavaScript
function greet(name) { return "Hi " + name.toUpperCase(); }
greet(42);            // crashes at runtime: name.toUpperCase is not a function

// TypeScript
function greet(name: string) { return "Hi " + name.toUpperCase(); }
greet(42);            // red squiggle in your editor, build fails. Never runs.
```

This project has `"strict": true` in `tsconfig.json`, which turns on the
strongest checks (most importantly: a value that could be `null` or
`undefined` must be handled before you use it).

Two house rules from `CLAUDE.md`:

- **No `any`.** `any` switches type checking off for that value and defeats
  the point. Use `unknown` plus a check (see §3.6).
- **Type errors are build blockers.** Don't reach for `// @ts-ignore`.

### Where the types live

Mostly right next to the code. Sometimes in a dedicated file:

- `content/case-studies/types.ts` — the shape of a case study.
- `lib/github.ts` — `ContributionDay`, `GithubContributions`.
- Everything else declares its props inline at the top of the component file.

---

## 3. The TypeScript you need for this repo

### 3.1 `interface` — the shape of an object

Real example, `content/case-studies/types.ts`:

```ts
export interface CaseStudy {
  slug: string;
  clientName: string;
  techStack: string[];                          // array of strings
  images: { src: string; alt: string }[];       // array of objects
  liveUrl?: string;                             // ? = optional, may be absent
  demoCredentials?: { email: string; password: string };
  featured: boolean;
}
```

Then a file *implements* it:

```ts
import type { CaseStudy } from "./types";

export const reisagri: CaseStudy = {
  slug: "reisagri",
  // ... if you forget `featured`, or typo `clientname`, the build fails
};
```

That is the payoff: six content files can't drift out of shape from each
other, and every component that renders one knows exactly what it's getting.

**`import type`** (rather than plain `import`) says "I only need this for
type-checking, erase it from the output." Use it whenever you're importing
something you only use in an annotation.

### 3.2 Union types — a value from a fixed set

`components/sections/ContactForm.tsx`:

```ts
type Status = "idle" | "submitting" | "success" | "error";
const [status, setStatus] = useState<Status>("idle");

setStatus("sucess");   // typo caught at build time
```

`components/ui/AmbientAudio.tsx` uses the same idea for the three-state
player, plus a `Record` to force you to label every state:

```ts
type Status = "pending" | "playing" | "paused";

const LABELS: Record<Status, string> = {
  pending: "Tap for sound",
  playing: "Sound on",
  paused:  "Sound off",
  // add a fourth Status and this object fails to compile until you fill it in
};
```

### 3.3 Typing component props

The convention here: declare an `interface` right above the component.

```tsx
// components/ui/Badge.tsx
interface BadgeProps {
  icon?: IconType;
  variant?: "subtle" | "accent";
  children: ReactNode;          // anything React can render
}

export function Badge({ icon: Icon, variant = "subtle", children }: BadgeProps) { ... }
```

Two JS things you'll see there that aren't TypeScript:

- `{ icon: Icon }` is destructuring **with rename** — the prop is `icon`
  (lowercase), but JSX only treats capitalised names as components, so it's
  renamed to `Icon` so `<Icon />` works.
- `variant = "subtle"` is a default value.

Extending built-in props, `components/ui/Button.tsx`:

```tsx
interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: IconType;
}
```

`extends AnchorHTMLAttributes<HTMLAnchorElement>` means "everything a real
`<a>` accepts (`target`, `rel`, `aria-label`, …) plus my four." Those extras
are collected with `...rest` and spread onto the `<Link>`.

### 3.4 Generics — `<Something>` after a name

A generic is a type that takes a type as an argument. You'll mostly *use*
them, not write them:

```ts
useState<Status>("idle")               // state that holds a Status
useRef<HTMLDivElement>(null)           // ref that will point at a <div>
useRef<(() => void) | null>(null)      // ref holding "a function, or null"
Record<Status, string>                 // object keyed by Status, string values
gsap.utils.toArray<HTMLElement>(".entry-word")
```

### 3.5 `as const` — freeze a literal

```ts
const events = ["pointerdown", "keydown", "touchend"] as const;
```

Without `as const` TypeScript widens this to `string[]`. With it, the type is
the exact tuple of those three literals — which is what lets
`window.addEventListener(type, ...)` accept `type` without complaint.

### 3.6 `unknown` + a type predicate — the safe way to handle input

This is the most important pattern in the repo, from
`app/api/contact/route.ts`. Data arriving over the network is genuinely
unknown; you must *prove* its shape before trusting it.

```ts
interface ContactPayload {
  firstName: string; lastName: string; email: string; message: string;
}

//                                     ↓ "if this returns true, treat body as ContactPayload"
function isContactPayload(body: unknown): body is ContactPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.firstName === "string" &&
    typeof b.lastName  === "string" &&
    typeof b.email     === "string" &&
    typeof b.message   === "string"
  );
}

const body: unknown = await request.json().catch(() => null);
if (!isContactPayload(body)) {
  return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
}
// from here down, TypeScript knows body.email is a string
```

`body is ContactPayload` is called a **type predicate**. It's how you narrow
`unknown` to a real type without writing `any`.

### 3.7 Narrowing

TypeScript follows your `if`s. This is why strict null checks aren't painful:

```tsx
const caseStudy = getCaseStudy(slug);   // CaseStudy | undefined
if (!caseStudy) notFound();             // notFound() never returns
// below this line caseStudy is CaseStudy — no more `?.` needed
```

```tsx
const image = caseStudy.images[0];
if (!image) return <span>Screenshot coming soon</span>;
return <Image src={image.src} ... />;   // image is definitely there
```

```tsx
// AmbientAudio: `target` is typed as EventTarget | null
if (target instanceof Element && target.closest("[data-ambient-toggle]")) return;
```

---

## 4. Next.js: the file system is the router

This project uses the **App Router** (the `app/` directory). There is no
routes file anywhere — the folder structure *is* the URL structure.

| File | URL |
|---|---|
| `app/(site)/page.tsx` | `/` |
| `app/(site)/work/page.tsx` | `/work` |
| `app/(site)/work/[slug]/page.tsx` | `/work/reisagri`, `/work/dropwatch`, … |
| `app/(site)/about/page.tsx` | `/about` |
| `app/(site)/setup/page.tsx` | `/setup` |
| `app/(site)/privacy/page.tsx` | `/privacy` |
| `app/api/contact/route.ts` | `POST /api/contact` |
| `app/api/views/route.ts` | `GET` / `POST /api/views` |

Filenames with special meaning:

- **`page.tsx`** — a page. Its default export is the component.
- **`layout.tsx`** — wraps every page beneath it. `app/layout.tsx` is the root
  layout: it renders `<html>` and `<body>` and the site-wide chrome. It
  **does not re-render on navigation**, which is exactly why `AmbientAudio`
  lives there — the track survives moving between pages instead of restarting.
- **`route.ts`** — an API endpoint instead of a page. Exports functions named
  after HTTP verbs (`export async function POST(request: Request)`).
- **`(site)`** — a **route group**. Parentheses mean "organise these files
  together but don't put this name in the URL." `/about`, not `/site/about`.
- **`[slug]`** — a **dynamic segment**. Whatever is in that position of the URL
  arrives as a param.

### Dynamic routes, concretely

`app/(site)/work/[slug]/page.tsx`:

```tsx
interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;    // note: a Promise in this Next version
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;        // so you must await it
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();           // renders the 404 page
  ...
}
```

`params` being a Promise is new-ish and catches people out. If you see
"property slug does not exist on type Promise", you forgot the `await`.

### `generateStaticParams` — pre-render at build time

```tsx
export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}
```

This tells Next: "here is the complete list of slugs, build all six pages as
static HTML now." Result: no server work per visitor, instant loads.

### `metadata` — the `<title>` and `<meta>` tags

Static, in `app/(site)/work/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Work — Abdus Salam",
  description: "...",
};
```

Per-URL, in `app/(site)/work/[slug]/page.tsx`:

```tsx
export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};
  return { title: `${caseStudy.clientName} — Case Study`, description: caseStudy.oneLiner };
}
```

You never write a `<head>` tag yourself.

### `<Link>` and `<Image>`

```tsx
import Link from "next/link";
import Image from "next/image";
```

- **`<Link href="/work">`** does client-side navigation (no full page reload)
  and prefetches. Use it for internal links. Use a plain `<a>` for external
  links, `mailto:`, `tel:` — see `LiveSiteLink` and `GithubActivity`. (`Button`
  handles this for you: it detects `http`-prefixed hrefs and adds
  `target="_blank" rel="noopener noreferrer"`.)
- **`<Image>`** is mandatory here (perf budget). It needs either `width`+
  `height` or `fill`. `fill` makes the image absolutely fill its nearest
  positioned ancestor — which is why every image in this repo sits inside a
  `relative` box with a fixed `aspect-[4/3]` or similar:

```tsx
<div className="relative aspect-[4/3] overflow-hidden">
  <Image
    src={image.src}
    alt={image.alt}
    fill
    sizes="(min-width: 768px) 33vw, 100vw"   // helps it pick a resolution
    className="object-cover"
  />
</div>
```

`priority` (used on the hero images) means "load this immediately, it's
above the fold." Everything else lazy-loads by default.

### The `@/` import alias

```tsx
import { Button } from "@/components/ui/Button";
```

`@/` is the repo root, set up in `tsconfig.json` under `paths`. Always prefer
it over `../../../components/ui/Button`.

---

## 5. Server Components vs Client Components

This is the single biggest conceptual difference from plain React, and the
source of most confusing errors. Learn it now.

**In the App Router, every component is a Server Component by default.** It
runs on the server (or at build time), never in the browser, and its
JavaScript is never sent to the visitor.

To opt a file into being a **Client Component**, put this as the very first
line:

```tsx
"use client";
```

|  | Server Component (default) | Client Component (`"use client"`) |
|---|---|---|
| `useState`, `useEffect`, `useRef` | ❌ | ✅ |
| `onClick`, `onChange`, any handler | ❌ | ✅ |
| `window`, `document`, `sessionStorage` | ❌ | ✅ |
| `async` / `await` in the component | ✅ | ❌ |
| Read secret env vars, call a DB | ✅ | ❌ |
| Ships JS to the browser | ❌ | ✅ |

Two things that trip people up:

**1. `"use client"` marks a boundary, not a single file.** Everything a client
component imports also becomes client code. So keep the boundary low in the
tree. This is why `Button` is a *server* component with pure-CSS hover effects
— making it a client component to get a hover animation would drag the hero,
every card grid and both footers into the browser bundle.

**2. A server component can render a client component and pass it data**, as
long as that data is serialisable (plain objects, arrays, strings, numbers —
not functions or class instances). `app/(site)/about/page.tsx` does exactly
this:

```tsx
// server component — it can be async and can fetch
export default async function AboutPage() {
  const contributions = await getGithubContributions(GITHUB_USERNAME);
  ...
  {contributions && <GithubActivity username={GITHUB_USERNAME} data={contributions} />}
}
```

`GithubActivity` is `"use client"` (it animates), but the network request
happened on the server. The browser gets the finished data, not the fetch.

**How to decide:** start server. Add `"use client"` only when you need state,
an event handler, a browser API, or a Framer Motion component.

---

## 6. Data flow in this site

Nothing the site *displays* comes from a database — the one exception is the
footer's visit total, which is a single integer in Redis (see `lib/views.ts`).
All the content is typed objects in `/content`. Trace one case study end to
end:

```
content/case-studies/reisagri.ts        one typed object
        ↓ imported by
content/case-studies/index.ts           array + getCaseStudy() + getFeaturedCaseStudies()
        ↓ imported by
app/(site)/page.tsx (server)            const featured = getFeaturedCaseStudies()
        ↓ passed as a prop
components/sections/WorkShowcase.tsx    "use client" — hover switches the preview
        ↓ renders
Link → /work/reisagri
        ↓
app/(site)/work/[slug]/page.tsx         getCaseStudy("reisagri")
        ↓ passed as props to
CaseStudyHero / CaseStudySection / CaseStudyGallery
```

And the one piece of live data:

```
lib/github.ts  →  fetch(jogruber.de mirror, { next: { revalidate: 3600 } })
               →  returns GithubContributions | null   (null on ANY failure)
               →  app/(site)/about/page.tsx renders the section only if non-null
```

`revalidate: 3600` is Next's caching: fetch once, reuse for an hour, refetch
after. The `| null` return is not defensive noise — a third-party outage must
not put a broken box on the page.

And the one write path:

```
ContactForm (client)  → fetch("/api/contact", { method: "POST", body: JSON })
                      → app/api/contact/route.ts (server, holds RESEND_API_KEY)
                      → Resend → inbox
                      → { ok: true } or { error: "..." } → <Toast />
```

**Why an API route at all?** Because `RESEND_API_KEY` must never reach the
browser. Anything in a client component is public. The route is the private
half.

### Env var rule

- `RESEND_API_KEY` — server-only. Readable in `route.ts`. Secret.
- `NEXT_PUBLIC_AMBIENT_AUDIO_URL` — the `NEXT_PUBLIC_` prefix tells Next to
  inline this value into the browser bundle. **Never put a secret behind that
  prefix.**

---

## 7. Tailwind v4 as used here

Tailwind means you write utility classes instead of a stylesheet:

```tsx
<div className="mt-4 flex flex-wrap justify-center gap-2">
```

= margin-top, flexbox, wrapping, centred, 0.5rem gap.

Things specific to **v4** (do not follow a v3 tutorial):

- **There is no `tailwind.config.js`.** Configuration is CSS, in
  `app/globals.css`.
- One import replaces the old three directives: `@import "tailwindcss";`
- Custom colours are declared twice — as a CSS variable in `:root`, then
  mapped into Tailwind in the `@theme inline` block:

```css
:root { --accent: #22c55e; }
@theme inline { --color-accent: var(--accent); }
```

  That second line is what creates `text-accent`, `bg-accent`,
  `border-accent`, and the opacity variants like `bg-accent/10`.

Syntax you'll see a lot in this repo:

| Pattern | Meaning |
|---|---|
| `md:flex` | applies at ≥768px (mobile-first: unprefixed = all sizes) |
| `bg-accent/10` | that colour at 10% opacity |
| `bg-accent/[0.04]` | arbitrary value — any number/colour/length in brackets |
| `group` + `group-hover:scale-110` | child reacts to the *parent's* hover |
| `group/btn` + `group-hover/btn:` | a **named** group, so nested groups don't collide |
| `z-[1]` / `z-[2]` | arbitrary z-index (the stretched-link pattern) |
| `size-4` | width and height together |
| `text-pretty` / `text-balance` | nicer line breaking for headings and paragraphs |

**When to write CSS instead of utilities:** when the effect needs keyframes,
pseudo-elements, or masks. Those live in the `@layer components` block of
`globals.css` — `.btn-premium`, `.beam-border`, `.surface-accent`,
`.link-underline`, `.eq-bar`. Reuse those classes rather than reinventing the
effect inline.

---

## 8. React hooks you will meet in this repo

Only rule that matters: **hooks run at the top level of a component, in the
same order every render.** Never inside an `if`, a loop, or after an early
`return`.

### `useState`
```tsx
const [open, setOpen] = useState(false);
setOpen((v) => !v);          // use the function form when the new value depends on the old
```

### `useEffect` — run something *after* render, and clean up

Every subscription/timer you start must be stopped in the returned function,
or it leaks:

```tsx
useEffect(() => {
  const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2600);
  return () => clearInterval(id);        // ← cleanup
}, [reduced]);                           // ← re-run when `reduced` changes
```

The array at the end is the **dependency array**: `[]` = run once on mount,
`[x]` = re-run whenever `x` changes, omitted = run after every render.

### `useRef` — a mutable box that does *not* trigger re-renders

Two distinct uses in this repo:

```tsx
const containerRef = useRef<HTMLDivElement>(null);   // 1. point at a DOM node
<div ref={containerRef} />

const frameRef = useRef<number | null>(null);        // 2. remember a value across renders
frameRef.current = requestAnimationFrame(step);
```

`EntrySequence` keeps `startedRef` **alongside** the `started` state, which
looks redundant but isn't: state updates are asynchronous, and both the
gesture handler and the GSAP callback need the current value *right now*,
before the re-render lands.

### `useCallback` — a stable function identity

```tsx
const start = useCallback(async () => { ... }, [fadeTo, getAudio]);
```

Without it, a new function is created every render, and any `useEffect` that
lists it as a dependency re-runs every render. Use it for functions that go
into dependency arrays or get passed to memoised children.

### `useLayoutEffect` — like `useEffect`, but before the browser paints

Used exactly once, in `EntrySequence`, and for a specific reason: it decides
whether to hide the intro overlay. With `useEffect` a returning visitor would
see the overlay flash on screen for one frame before it disappeared.

### `useSyncExternalStore` — subscribe to something outside React

This is the unusual one. Used twice: `lib/reduced-motion.ts` (the OS
"reduce motion" setting) and `lib/ambient-mute.ts` (a `sessionStorage` flag).

```ts
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

You supply three functions: how to subscribe, how to read the current value,
and **what the value is on the server**. That third one is the point. During
server rendering there is no `window`, so it returns a safe default (`false`)
and the client picks up the real value without a hydration mismatch.

The naive alternative — `useState` + `useEffect` to read `matchMedia` — is
rejected by the `react-hooks/set-state-in-effect` lint rule and causes a
flash. If you need a browser-only value in this repo, copy the store shape in
`lib/ambient-mute.ts`.

### Sometimes you need no hook at all

`Nav` closes its mobile menu on route change by adjusting state during render:

```tsx
const [prevPathname, setPrevPathname] = useState(pathname);
if (pathname !== prevPathname) { setPrevPathname(pathname); setOpen(false); }
```

That's a legitimate React pattern (see "You Might Not Need an Effect" in the
React docs) and it's one render pass instead of two.

---

## 9. Animation: Framer Motion and GSAP

The division of labour is fixed by `CLAUDE.md`: **GSAP is only for the entry
sequence. Everything else is Framer Motion.** Don't mix them for the same job.

### Framer Motion in 90 seconds

Swap an element for its `motion` equivalent and give it animation props:

```tsx
import { motion } from "framer-motion";

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

Instead of writing those objects inline, this repo uses **named variants**
defined once in `lib/motion.ts`:

```ts
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
```

and referenced by name:

```tsx
<motion.section
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"                       // trigger when scrolled into view
  viewport={{ once: true, margin: "-80px" }}  // only once, 80px before the edge
/>
```

**Stagger** — a parent with `staggerChildren` orchestrates its children;
children just need `variants={fadeUp}` and inherit `initial`/`animate`:

```tsx
<motion.div variants={staggerChildren} initial="hidden" animate="visible">
  <motion.div variants={fadeUp}>first</motion.div>
  <motion.div variants={fadeUp}>second, 0.08s later</motion.div>
</motion.div>
```

**`AnimatePresence`** lets an element animate *out* before React removes it.
It needs a changing `key` to know something was swapped:

```tsx
<AnimatePresence mode="wait" initial={false}>
  <TypeReveal key={role} text={role} reduced={reduced} />
</AnimatePresence>
```

`mode="wait"` = finish the exit before starting the enter.

**The house rule:** if you need a new animation, add a variant to
`lib/motion.ts` and import it. Don't write variant objects inside components.

### GSAP, in `EntrySequence` only

GSAP builds a **timeline** — a list of tweens placed at explicit times:

```ts
const tl = gsap.timeline({ paused: true, onComplete: finish });
tl.to(word, { opacity: 1, xPercent: 0, duration: 0.15 }, at);   // 3rd arg = start time
```

Two structural details worth understanding:

```ts
ctx = gsap.context(() => { ... }, containerRef);
// ...later
return () => { ctx?.revert(); };
```

`gsap.context` scopes selectors to that container and gives you `revert()`,
which undoes every tween it created — the cleanup for React's unmount.

```ts
import("gsap").then(({ default: gsap }) => { ... });
```

That's a **dynamic import**: GSAP is only downloaded when the intro actually
runs, instead of being bundled into every page load on every route.

---

## 10. Accessibility rules that are not optional here

`CLAUDE.md` makes these requirements, not preferences.

**1. `prefers-reduced-motion` — every animation, every time.** Some people get
motion sickness from parallax and big transitions; their OS setting says so
and we obey it.

- In JS: `const reduced = useReducedMotion()` then
  `initial={reduced ? "visible" : "hidden"}` — i.e. start at the final state
  and skip the animation entirely.
- In CSS: add your rule to the `@media (prefers-reduced-motion: reduce)` block
  at the bottom of `globals.css`. The convention there is **keep the colour,
  drop the movement** — a frozen comet at 12 o'clock looks broken, a static
  ring looks intentional.
- `EntrySequence` skips itself entirely under reduced motion.

**2. Every page must make sense with zero motion.** If stripping the animation
leaves content that doesn't parse, the content structure is wrong — fix the
structure, not the animation.

**3. Decorative things must be hidden from screen readers.**
`aria-hidden="true"` plus `pointer-events-none` on glows, gradients, beams,
equaliser bars, decorative icons. See `BeamBorder`, every gradient overlay,
every `<Icon aria-hidden="true" />`.

**4. Interactive things must be labelled.** Icon-only buttons and links need
`aria-label`. Toggles need `aria-pressed`; expanding menus need
`aria-expanded` and `aria-controls`. Examples in `BackButton`, `Nav`,
`AmbientAudio`, `LiveSiteLink`, `DemoCredentials`.

**5. Keyboard parity.** If it works with a tap it must work with a key —
`EntrySequence` handles `Escape` to skip and any other key to enter, and
deliberately leaves `Tab` alone so the Skip button stays reachable.

**6. Contrast.** Accent *text* uses `--accent-bright`. `--accent` and
`--accent-deep` are for borders, glows and fills only.

**7. Every image needs a real `alt`** describing the content, not the
filename. Look at the case study content files for the tone.

---

## 11. Your first three tasks

Do these in order. They cover content, styling and components.

### Task 1 — add a case study (content only, no components)

1. `content/case-studies/my-project.ts`:

```ts
import type { CaseStudy } from "./types";

export const myProject: CaseStudy = {
  slug: "my-project",                       // becomes /work/my-project
  clientName: "My Project",
  category: "Product / Solo Build",
  oneLiner: "One line for the card.",
  problem: "2–4 sentences on what was needed.",
  approach: "2–4 sentences on what was actually built and decided.",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  outcome: "Live and in active use.",       // NEVER invent a metric
  images: [{ src: "/images/work/my-project/hero.webp", alt: "Describe the screenshot." }],
  liveUrl: "https://example.com",           // optional
  featured: false,                          // true = also show on the homepage
};
```

2. Register it in `content/case-studies/index.ts` (import + push into the
   array).
3. Put the screenshot at `public/images/work/my-project/hero.webp`.
4. `npm run dev` → visit `/work` and `/work/my-project`.

Notice what you did **not** have to touch: the grid, the detail page,
`generateStaticParams`, the metadata. All of it derives from the array.

### Task 2 — retune the accent colour

Open `app/globals.css`, change `--accent-bright` in `:root`, reload. Every
piece of accent text across the site moves together, because nothing
hard-codes a colour.

Now try adding a brand-new token — remember it takes **two** lines (a `:root`
variable *and* a `--color-*` entry in `@theme inline`) before
`text-my-token` exists as a utility.

### Task 3 — add a section to the About page

Open `app/(site)/about/page.tsx`. Copy the shape of the Education block:

```tsx
<CaseStudySection label="Certifications" center>
  <p className="mt-4 text-lg text-foreground/80">…</p>
</CaseStudySection>
```

`CaseStudySection` (in `components/case-study/CaseStudyContent.tsx`) already
handles the heading style, the top border, the scroll reveal and the
reduced-motion path. That's the general lesson: **look for an existing
component before you build one.**

---

## 12. Debugging: common errors and what they mean

| Error | Cause | Fix |
|---|---|---|
| `You're importing a component that needs useState. This React hook only works in a client component.` | Hook in a server component | Add `"use client"` at the top — or, better, move the interactive bit into its own small client component |
| `window is not defined` / `sessionStorage is not defined` | Browser API touched during server render | Move it into a `useEffect`, or use the `useSyncExternalStore` store pattern in `lib/ambient-mute.ts` |
| `Hydration failed because the server rendered HTML didn't match the client` | Something differs between server and first client render — `Date.now()`, `Math.random()`, `window.matchMedia` | Render the same thing on both, then correct it after mount. `EntrySequence` and `useReducedMotion` are the worked examples |
| `Property 'slug' does not exist on type 'Promise<...>'` | Forgot to `await params` | `const { slug } = await params;` |
| `Type 'string \| undefined' is not assignable to type 'string'` | Optional field used without a check | Narrow it first: `if (!x) return null;` or `{x && <Thing/>}` |
| `Error: Image with src ... is missing required "width" property` | `<Image>` without `fill` or explicit dimensions | Add `fill` and wrap in a `relative` box with an aspect ratio |
| `Functions cannot be passed directly to Client Components` | Passing a function prop from a server to a client component | Move the handler inside the client component |
| Hover/click doesn't work on part of a card | The stretched overlay `<Link>` is on top | Add `relative z-[2]` to the element (see `LiveSiteLink`) |
| `react-hooks/set-state-in-effect` lint error | `setState` inside an effect reading browser state | Use `useSyncExternalStore` |

Useful habits: read the **first** error, not the last; `npm run build` catches
things `npm run dev` lets slide; when an animation misbehaves, first check
whether the reduced-motion branch is the one running.

---

## 13. Glossary

- **App Router** — Next's current routing system, based on the `app/` folder.
- **Server Component** — default; runs on the server, ships no JS.
- **Client Component** — marked `"use client"`; runs in the browser, can use
  hooks and events.
- **Hydration** — React attaching event handlers to server-rendered HTML in
  the browser. A "hydration mismatch" means the two renders disagreed.
- **Route group** — a folder in parentheses, e.g. `(site)`; organises files
  without affecting the URL.
- **Dynamic segment** — a folder in brackets, e.g. `[slug]`; matches any value
  and passes it as a param.
- **`generateStaticParams`** — lists every value of a dynamic segment so Next
  can pre-build those pages.
- **Variant** (Framer Motion) — a named animation state (`hidden`/`visible`)
  defined once and referenced by name.
- **Stagger** — children of an animated parent starting one after another.
- **Type predicate** — a function returning `x is T`, used to narrow `unknown`
  safely.
- **Narrowing** — TypeScript deducing a more specific type from your `if`
  checks.
- **Stretched link** — an absolutely positioned `<Link>` covering a card, so
  the whole card is clickable without nesting anchors.
- **Design token** — a CSS variable holding a colour, used everywhere instead
  of a literal hex value.

---

## Where to go next

- `NOTES.md` — the architecture map: what each folder holds, how the audio and
  motion systems fit together, known gotchas, and a "where to start for a
  given task" table.
- `CLAUDE.md` — the product decisions and the rules. Read the "Animation
  philosophy", "Background audio" and "What NOT to do" sections before you
  change anything animated or audible.
- `README.md` — setup and the background-music hosting requirements.
- `node_modules/next/dist/docs/` — the docs for *this exact* Next version,
  which is more reliable than a blog post or an LLM's memory.
