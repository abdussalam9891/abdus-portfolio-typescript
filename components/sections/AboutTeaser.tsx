"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";

export function AboutTeaser() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 py-16 md:py-24 border-t border-accent/15"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-gradient-accent text-2xl md:text-3xl font-semibold">
          Who&apos;s building this
        </h2>
        <p className="mt-4 text-foreground/70">
          I&apos;m a full-stack dev based in{" "}
          <span className="text-accent-bright">New Delhi</span>. I build things{" "}
          <strong className="text-accent-glow font-semibold">
            start to finish
          </strong>{" "}
          — design, code, database, deployment — for a remote day job, and
          for freelance clients most nights.
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
