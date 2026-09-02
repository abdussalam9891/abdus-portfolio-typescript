"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import { CONTACT } from "@/lib/contact";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

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
      <blockquote className="max-w-2xl mx-auto">
        <p className="text-lg text-foreground/80">
          &ldquo;When you give up, your dreams and everything else fade
          away.&rdquo;
        </p>
        <cite className="mt-2 block text-sm text-accent-bright/70 not-italic">
          — Ichigo Kurosaki, Bleach
        </cite>
      </blockquote>

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
