"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import type { ReactNode } from "react";

/**
 * Shared section wrapper for case study detail pages — a single scroll
 * reveal on the section container (per CLAUDE.md: case study pages get
 * lighter treatment than the homepage, don't animate body copy itself).
 */
export function CaseStudySection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 py-10 border-t border-foreground/10"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <div className="max-w-3xl">
        <h2 className="text-sm uppercase tracking-widest text-foreground/50">
          {label}
        </h2>
        {children}
      </div>
    </motion.section>
  );
}
