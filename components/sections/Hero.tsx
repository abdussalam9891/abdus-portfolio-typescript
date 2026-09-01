"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 pt-28 pb-20 md:pt-40 md:pb-28"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={staggerChildren}
    >
      <motion.p
        variants={fadeUp}
        className="text-sm uppercase tracking-widest text-foreground/60 mb-6"
      >
        Full-stack developer — New Delhi, India
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] max-w-4xl"
      >
        Full-stack developer who ships. Production sites and apps for
        businesses, start to finish.
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="mt-6 text-lg text-foreground/70 max-w-2xl"
      >
        I work a full-time remote dev job and take on freelance client work
        on the side — designing, building, and shipping real products, not
        prototypes.
      </motion.p>
      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
        <Button href="/work">See the work</Button>
        <Button href="/contact" variant="ghost">
          Get in touch
        </Button>
      </motion.div>
    </motion.section>
  );
}
