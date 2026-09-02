"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
      <motion.div variants={fadeUp}>
        <Link
          href="/work"
          className="link-underline text-sm text-foreground/60 transition-colors duration-300 hover:text-accent-bright"
        >
          ← All work
        </Link>
      </motion.div>
      <motion.div variants={fadeUp} className="mt-6">
        <Badge variant="accent">{caseStudy.category}</Badge>
      </motion.div>
      <motion.h1
        variants={fadeUp}
        className="text-gradient-accent mt-4 text-4xl md:text-6xl font-semibold"
      >
        {caseStudy.clientName}
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="mt-4 text-lg text-foreground/70 max-w-2xl"
      >
        {caseStudy.oneLiner}
      </motion.p>
    </motion.section>
  );
}
