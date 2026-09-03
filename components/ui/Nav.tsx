"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, slideInLeft, staggerChildren } from "@/lib/motion";
import { BackButton } from "@/components/ui/BackButton";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [homeHintOpen, setHomeHintOpen] = useState(false);

  // Close the mobile menu on route change (e.g. back/forward navigation).
  // Adjusting state during render (rather than in an effect) avoids an
  // extra cascading render — see https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-accent/15 bg-background/80 backdrop-blur"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={fadeUp}
    >
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-3">
          {/* Every page except home gets an explicit way back to it, without
              relying on the wordmark being read as a link. */}
          <AnimatePresence initial={false}>
            {pathname !== "/" && (
              <motion.div
                key="back"
                variants={slideInLeft}
                initial={reduced ? "visible" : "hidden"}
                animate="visible"
                exit={reduced ? { opacity: 0, transition: { duration: 0.01 } } : "exit"}
                className="flex items-center"
              >
                <BackButton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wordmark. Hovering (or focusing) it drops a small "Home" label
              underneath, so the destination is named rather than assumed. */}
          <div
            className="relative"
            onMouseEnter={() => setHomeHintOpen(true)}
            onMouseLeave={() => setHomeHintOpen(false)}
            onFocus={() => setHomeHintOpen(true)}
            onBlur={() => setHomeHintOpen(false)}
          >
            <Link
              href="/"
              className="group flex items-center font-semibold tracking-tight"
            >
              <span className="transition-colors duration-300 group-hover:text-accent-bright">
                Abdus
              </span>
            </Link>

            <AnimatePresence initial={false}>
              {homeHintOpen && (
                <motion.div
                  key="home-hint"
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduced ? 0.01 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full z-50 pt-2"
                >
                  <Link
                    href="/"
                    className="block rounded-md border border-accent/25 bg-background/95 px-3 py-1.5 text-xs text-foreground/70 shadow-lg shadow-black/30 backdrop-blur transition-colors duration-300 hover:border-accent/50 hover:text-accent-bright"
                  >
                    Home
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
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

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.05] text-foreground transition-colors duration-300 hover:border-accent/60 hover:text-accent-bright"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={reduced ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: reduced ? 0.01 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                {open ? <FiX size={18} /> : <FiMenu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            key="mobile-menu"
            initial={reduced ? { opacity: 1, height: "auto" } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-accent/15 md:hidden"
          >
            <motion.div
              variants={staggerChildren}
              initial={reduced ? "visible" : "hidden"}
              animate="visible"
              className="flex flex-col px-6 py-2"
            >
              {LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <motion.div key={href} variants={fadeUp}>
                    <Link
                      href={href}
                      className={`block py-3 text-base transition-colors duration-300 ${
                        active
                          ? "font-medium text-accent-bright"
                          : "text-foreground/60 hover:text-accent-soft"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
