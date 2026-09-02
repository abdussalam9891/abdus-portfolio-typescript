"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiDownload, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BeamBorder } from "@/components/ui/BeamBorder";
import { TypeReveal } from "@/components/ui/TypeReveal";
import { useReducedMotion } from "@/lib/reduced-motion";
import {
  fadeUp,
  staggerChildren,
  quoteContainer,
  quoteWord,
  quoteRevealDurationS,
} from "@/lib/motion";
import { COVER_QUOTE } from "@/lib/quotes";

const ROLES = ["Full-stack Developer", "E&C Engineer", "Always Learning"];
const ROLE_INTERVAL_MS = 2600;

const BLOBS = [
  {
    className: "-left-10 -top-10 h-56 w-56 bg-accent/45",
    from: { x: 0, y: 0 },
    to: { x: 30, y: 20 },
    duration: 9,
  },
  {
    className: "right-0 -top-16 h-64 w-64 bg-accent-deep/40",
    from: { x: 0, y: 0 },
    to: { x: -20, y: 30 },
    duration: 11,
  },
  {
    className: "left-1/3 bottom-0 h-48 w-48 bg-accent-bright/30",
    from: { x: 0, y: 0 },
    to: { x: 20, y: -20 },
    duration: 8,
  },
];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 pt-28 pb-20 md:pt-36 md:pb-28"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={staggerChildren}
    >
      <div className="mx-auto max-w-4xl">
        {/* Cover banner */}
        <motion.div
          variants={fadeUp}
          className="accent-bloom relative h-40 sm:h-52 md:h-60 overflow-hidden rounded-3xl bg-surface"
        >
          {BLOBS.map((blob, i) => (
            <motion.span
              key={i}
              className={`absolute rounded-full blur-3xl ${blob.className}`}
              initial={blob.from}
              animate={reduced ? blob.from : { x: [blob.from.x, blob.to.x, blob.from.x], y: [blob.from.y, blob.to.y, blob.from.y] }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: blob.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--accent) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Cover image, filling the entire banner */}
          <motion.div
            className="absolute inset-0"
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
            }
          >
            <Image
              src="/images/hero/bob-marley-portrait.png"
              alt="Bob Marley portrait rendered in green, gold and red against a black background."
              fill
              sizes="(min-width: 768px) 896px, 100vw"
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Ties the cover art into the page palette — the artwork's own
              green is the anchor, this just carries it to the edges. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-deep/25 via-transparent to-accent/15 mix-blend-screen"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/70 to-transparent"
          />

          <CoverQuote reduced={reduced} />

          <BeamBorder glow duration={6} arc={0.16} />
        </motion.div>

        {/* Avatar + actions row, overlapping the banner */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 px-2 -mt-12 sm:-mt-14 md:-mt-16"
        >
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36 shrink-0 overflow-hidden rounded-full border-4 border-background bg-accent/5 shadow-[0_0_30px_-6px_rgb(34_197_94/0.55)]">
            <Image
              src="/images/about/abdus-salam.png"
              alt="Portrait of Abdus Salam"
              fill
              sizes="(min-width: 768px) 144px, 96px"
              className="object-cover"
              priority
            />
            <BeamBorder duration={5} width={2} />
          </div>
          <div className="flex gap-2 sm:gap-3 pb-1">
            <Button href="/contact" icon={FiMail}>
              Contact
            </Button>
            <Button
              href="/files/Abdus_Salam_Resume.pdf"
              variant="ghost"
              icon={FiDownload}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </Button>
          </div>
        </motion.div>

        {/* Identity */}
        <motion.div variants={fadeUp} className="mt-6 px-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-gradient-accent text-3xl md:text-4xl font-semibold">
              Abdus Salam
            </h1>
            <Badge icon={FiMapPin}>New Delhi, India</Badge>
          </div>
          <p className="mt-2 text-lg text-accent-bright/90 flex items-center">
            <RotatingRole reduced={reduced} />
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-6 px-2 text-lg text-foreground/70 max-w-2xl"
        >
          I work a full-time remote dev job and take on{" "}
          <span className="text-accent-glow font-medium">freelance client work</span>{" "}
          on the side — designing, building, and{" "}
          <span className="text-accent-glow font-medium">shipping real products</span>,
          not prototypes.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 px-2 flex flex-wrap gap-4"
        >
          <Button href="/work">See the work</Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

/**
 * The cover quote, set over the right of the banner the way the original
 * artwork had it baked into the image — but as real text, so it stays sharp
 * at every size, is selectable, reaches screen readers, and can animate.
 *
 * Hidden below `sm`: the banner is only 10rem tall there and the art's face
 * runs straight through the middle, so the quote would land on top of it at
 * a size nobody can read. The footer's rotating quote still carries the line
 * on mobile.
 */
function CoverQuote({ reduced }: { reduced: boolean }) {
  const words = COVER_QUOTE.text.split(" ");

  return (
    <div className="absolute inset-y-0 right-0 hidden w-[58%] sm:flex sm:items-center sm:justify-end md:w-[42%]">
      {/* The art is near-black on the right, but the face's red edge creeps
          in at some crops — this keeps the text off it at every width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-background/85 via-background/45 to-transparent"
      />
      <blockquote className="relative pr-5 text-right md:pr-7">
        <motion.p
          className="font-serif text-sm font-semibold leading-snug text-foreground/95 [text-shadow:0_2px_14px_rgb(0_0_0/0.85)] md:text-base md:leading-relaxed"
          variants={quoteContainer}
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
        >
          {words.map((word, i) => (
            // Words animate on a transform, so each one has to be
            // inline-block; the spaces between them stay plain text nodes so
            // lines still break at word boundaries (same trick as TypeReveal).
            <Fragment key={i}>
              <motion.span className="inline-block" variants={quoteWord}>
                {word}
              </motion.span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </motion.p>
        <motion.cite
          className="mt-1.5 block font-serif text-xs not-italic text-accent-bright/80 [text-shadow:0_2px_10px_rgb(0_0_0/0.85)] md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.6, delay: quoteRevealDurationS(words.length) - 0.3 }
          }
        >
          — {COVER_QUOTE.author}
        </motion.cite>
      </blockquote>
    </div>
  );
}

function RotatingRole({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, ROLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const role = reduced ? ROLES[0] : ROLES[index];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <TypeReveal key={role} text={role} reduced={reduced} />
    </AnimatePresence>
  );
}
