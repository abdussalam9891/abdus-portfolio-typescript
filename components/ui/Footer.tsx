"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { TypeReveal } from "@/components/ui/TypeReveal";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, typeDurationMs } from "@/lib/motion";
import { CONTACT } from "@/lib/contact";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const QUOTES = [
  {
    text: "Emancipate yourselves from mental slavery, none but ourselves can free our minds.",
    author: "Bob Marley",
  },
  {
    text: "Work is love made visible.",
    author: "Kahlil Gibran",
  },
  {
    text: "When you give up, your dreams and everything else fade away.",
    author: "Ichigo Kurosaki, Bleach",
  },
  {
    text: "A dropout will beat a genius through hard work.",
    author: "Rock Lee, Naruto",
  },
  {
    text: "If you don't take risks, you can't create a future.",
    author: "Monkey D. Luffy, One Piece",
  },
  {
    text: "A lesson without pain is meaningless, for you cannot gain something without sacrificing something else in return.",
    author: "Edward Elric, Fullmetal Alchemist",
  },
];
// How long a quote stays up once it has finished typing. The typing time
// itself is derived from the shared variants, so a long quote is never
// swapped out mid-sentence.
const QUOTE_HOLD_MS = 3200;

function quoteDurationMs(text: string) {
  return typeDurationMs(text.replace(/\s/g, "").length) + QUOTE_HOLD_MS;
}

export function Footer() {
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="mt-auto border-t border-accent/15 px-6 md:px-10 py-12 text-center"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <RotatingQuote reduced={reduced} />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/60">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="link-underline transition-colors duration-300 hover:text-accent-bright"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 border-t border-accent/15 pt-6 text-xs text-foreground/50 sm:flex-row sm:justify-between">
        <p>© {year} Abdus. All rights reserved.</p>
        <p>
          Designed &amp; Developed by{" "}
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent-bright transition-colors duration-300 hover:text-accent-soft"
          >
            Abdus
          </a>
        </p>
      </div>
    </motion.footer>
  );
}

function RotatingQuote({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % QUOTES.length),
      quoteDurationMs(QUOTES[index].text),
    );
    return () => clearTimeout(id);
  }, [reduced, index]);

  const quote = reduced ? QUOTES[0] : QUOTES[index];

  return (
    <blockquote className="max-w-2xl mx-auto flex min-h-[9rem] flex-col justify-center sm:min-h-[8rem]">
      <AnimatePresence mode="wait" initial={false}>
        <QuoteCard key={quote.text} quote={quote} reduced={reduced} />
      </AnimatePresence>
    </blockquote>
  );
}

function QuoteCard({
  quote,
  reduced,
}: {
  quote: { text: string; author: string };
  reduced: boolean;
}) {
  const [citeVisible, setCiteVisible] = useState(reduced);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-lg text-foreground/80">
        <TypeReveal
          text={`“${quote.text}”`}
          reduced={reduced}
          reserve
          onComplete={() => setCiteVisible(true)}
        />
      </p>
      <motion.cite
        className="mt-2 block text-sm text-accent-bright/70 not-italic"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: citeVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        — {quote.author}
      </motion.cite>
    </motion.div>
  );
}
