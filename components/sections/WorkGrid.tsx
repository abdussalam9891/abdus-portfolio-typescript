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
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-gradient-accent text-2xl md:text-3xl font-semibold">
            {title}
          </h2>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 justify-center"
          initial={reduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
        >
          {caseStudies.map((caseStudy) => (
            <WorkCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
