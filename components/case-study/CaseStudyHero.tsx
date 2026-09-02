"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";
import type { CaseStudy } from "@/content/case-studies";

export function CaseStudyHero({ caseStudy }: { caseStudy: CaseStudy }) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 pt-28 pb-12 md:pt-36 md:pb-16"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={staggerChildren}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/*
         * Matches the circular back affordance in components/ui/BackButton.tsx
         * — same border, glow and arrow-slide on hover — but keeps its label,
         * since "All work" is a different destination from the nav's "home".
         */}
        <motion.div variants={fadeUp}>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.05] px-4 py-2 text-sm text-foreground/70 transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent-bright hover:shadow-[0_0_18px_-4px_rgb(34_197_94/0.6)]"
          >
            <FiArrowLeft
              size={16}
              aria-hidden="true"
              className="shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            All work
          </Link>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-6">
          <Badge variant="accent">{caseStudy.category}</Badge>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="text-gradient-accent mt-4 text-3xl sm:text-4xl md:text-6xl font-semibold text-balance"
        >
          {caseStudy.clientName}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-base sm:text-lg text-foreground/70 max-w-2xl text-pretty"
        >
          {caseStudy.oneLiner}
        </motion.p>
      </div>
    </motion.section>
  );
}
