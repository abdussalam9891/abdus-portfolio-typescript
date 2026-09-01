"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";

export function AboutTeaser() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 py-16 md:py-24 border-t border-foreground/10"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Who&apos;s building this
        </h2>
        <p className="mt-4 text-foreground/70">
          I&apos;m Abdus Salam, a full-stack developer based in New Delhi, India.
          Full-time remote dev job, plus freelance client work on the side —
          I&apos;ve shipped e-commerce platforms, B2B sites, and solo
          products end to end.
        </p>
        <div className="mt-6">
          <Button href="/about" variant="ghost">
            More about me
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
