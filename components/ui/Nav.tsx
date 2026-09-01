"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
      className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={fadeUp}
    >
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Abdus Salam
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors hover:text-foreground ${
                  active ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
