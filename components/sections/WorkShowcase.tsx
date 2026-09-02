"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/reduced-motion";
import { BeamBorder } from "@/components/ui/BeamBorder";
import { fadeUp, staggerChildren, crossFade } from "@/lib/motion";
import type { CaseStudy } from "@/content/case-studies";

// Three depths of the same green rather than three different hues — the
// preview glow should shift as you scan the list, not change subject.
const GLOW_COLORS = ["bg-accent/30", "bg-accent-deep/35", "bg-accent-bright/25"];

interface WorkShowcaseProps {
  caseStudies: CaseStudy[];
  title?: string;
}

export function WorkShowcase({ caseStudies, title = "Selected work" }: WorkShowcaseProps) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = caseStudies[activeIndex];

  if (!active) return null;

  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="flex flex-col items-center text-center mb-12"
          initial={reduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <h2 className="text-gradient-accent text-2xl md:text-3xl font-semibold">
            {title}
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 md:items-start"
          initial={reduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
        >
          {/* Preview */}
          <motion.div variants={fadeUp} className="md:sticky md:top-28">
            <Link
              href={`/work/${active.slug}`}
              className="surface-accent group relative block aspect-[4/3] overflow-hidden rounded-3xl border bg-surface"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-6 -z-10 rounded-3xl blur-3xl transition-colors duration-500 ${GLOW_COLORS[activeIndex % GLOW_COLORS.length]}`}
              />
              {reduced ? (
                <PreviewImage caseStudy={active} />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.slug}
                    variants={crossFade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <PreviewImage caseStudy={active} />
                  </motion.div>
                </AnimatePresence>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-deep/30 via-transparent to-accent/15 mix-blend-screen" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 text-white">
                <span className="text-sm font-medium transition-colors duration-300 group-hover:text-accent-bright">
                  {active.clientName}
                </span>
                <span className="translate-x-0 text-accent-bright transition-transform duration-300 group-hover:translate-x-1">
                  <FiArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </div>
              <BeamBorder glow duration={5} arc={0.14} />
            </Link>
          </motion.div>

          {/* List */}
          <motion.ul variants={fadeUp} className="flex flex-col divide-y divide-accent/15">
            {caseStudies.map((caseStudy, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={caseStudy.slug}>
                  <Link
                    href={`/work/${caseStudy.slug}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`group flex items-start justify-between gap-4 border-l-2 py-5 pl-4 pr-2 transition-colors duration-300 ${
                      isActive
                        ? "border-accent bg-accent/[0.07]"
                        : "border-transparent hover:border-accent/40 hover:bg-accent/[0.03]"
                    }`}
                  >
                    <span>
                      <span
                        className={`flex items-center gap-2 text-base font-medium transition-colors duration-300 ${
                          isActive ? "text-accent-bright" : "group-hover:text-accent-soft"
                        }`}
                      >
                        {caseStudy.clientName}
                      </span>
                      <span className="mt-1 block text-sm text-foreground/60 leading-relaxed">
                        {caseStudy.oneLiner}
                      </span>
                    </span>
                    <FiArrowUpRight
                      className="mt-1 size-4 shrink-0 text-accent/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-bright"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
            <li className="pt-6">
              <Button href="/work">View all projects</Button>
            </li>
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewImage({ caseStudy }: { caseStudy: CaseStudy }) {
  const image = caseStudy.images[0];

  if (!image) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-xs uppercase tracking-wide text-white/40">
          Screenshot coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-cover"
    />
  );
}
