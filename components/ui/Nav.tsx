"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-accent/15 bg-background/80 backdrop-blur"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={fadeUp}
    >
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight"
        >
          {/* Small green pulse next to the wordmark — the site's one piece
              of always-on ambient motion outside the hero. */}
          <span aria-hidden="true" className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-bright" />
          </span>
          <span className="transition-colors duration-300 group-hover:text-accent-bright">
            Abdus
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                data-active={active}
                className={`link-underline transition-colors duration-300 hover:text-accent-bright ${
                  active ? "text-accent-bright" : "text-foreground/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
