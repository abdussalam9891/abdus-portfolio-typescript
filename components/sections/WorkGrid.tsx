"use client";

import { motion } from "framer-motion";
import { WorkCard } from "@/components/sections/WorkCard";
import { useReducedMotion } from "@/lib/reduced-motion";
import { staggerChildren } from "@/lib/motion";
import type { CaseStudy } from "@/content/case-studies";

interface WorkGridProps {
  caseStudies: CaseStudy[];
  title?: string;
}

export function WorkGrid({ caseStudies, title = "Selected work" }: WorkGridProps) {
  const reduced = useReducedMotion();

  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={reduced ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren}
      >
        {caseStudies.map((caseStudy) => (
          <WorkCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </motion.div>
    </section>
  );
}
