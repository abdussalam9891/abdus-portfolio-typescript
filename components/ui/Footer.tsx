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
      className="mt-auto border-t border-foreground/10 px-6 md:px-10 py-12"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <blockquote className="max-w-2xl">
        <p className="text-lg text-foreground/80">
          &ldquo;When you give up, your dreams and everything else fade
          away.&rdquo;
        </p>
        <cite className="mt-2 block text-sm text-foreground/50 not-italic">
          — Ichigo Kurosaki, Bleach
        </cite>
      </blockquote>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/60">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="transition-colors hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-2 border-t border-foreground/10 pt-6 text-xs text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Abdus. All rights reserved.</p>
        <p>
          Designed &amp; Developed by{" "}
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Abdus
          </a>
        </p>
      </div>
    </motion.footer>
  );
}
