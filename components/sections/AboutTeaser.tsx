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
    I&apos;m a full-stack developer based in{" "}
    <span className="text-accent-bright">New Delhi</span>. I enjoy taking
    an idea from{" "}
    <strong className="text-accent-glow font-semibold">
      “what if we built this?”
    </strong>{" "}
    to something real — designing it, coding it, getting it live, and
    figuring out everything in between.
  </p>

  <p className="mt-4 text-foreground/70">
    Alongside my day job, I work with freelance clients on websites and
    digital products — from the first line of code to{" "}
    <strong className="text-accent-glow font-semibold">
      the final deployment.
    </strong>
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
