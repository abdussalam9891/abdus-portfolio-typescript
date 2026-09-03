"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { BeamBorder } from "@/components/ui/BeamBorder";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { SOCIAL } from "@/lib/contact";

export function AboutIntro() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 pt-8 pb-12 md:pt-10 md:pb-16"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={staggerChildren}
    >
      <div className="flex flex-col items-center text-center gap-8">
        <motion.div
          variants={fadeUp}
          className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden bg-accent/5 shadow-[0_0_50px_-10px_rgb(34_197_94/0.6)]"
        >
          <Image
            src="/images/about/abdus-salam.png"
            alt="Portrait of Abdus Salam"
            fill
            sizes="(min-width: 768px) 224px, 160px"
            className="object-cover"
            priority
          />
          <BeamBorder glow duration={5} width={2} />
        </motion.div>
        <div className="flex flex-col items-center">
          <motion.p
            variants={fadeUp}
            className="text-sm uppercase tracking-widest text-accent-bright/80 mb-6"
          >
            About
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-gradient-accent text-4xl md:text-6xl font-semibold max-w-3xl"
          >
            Abdus Salam
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-foreground/70 max-w-2xl"
          >
            I&apos;m a full-stack dev based in{" "}
            <span className="text-accent-bright">New Delhi</span>. I build things{" "}
            <strong className="text-accent-glow font-semibold">
              start to finish
            </strong>{" "}
            — design, code, database, deployment, the whole thing — instead
            of just one slice of the stack.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-foreground/70 max-w-2xl"
          >
            Day job&apos;s hybrid, but{" "}
            <strong className="text-accent-glow font-semibold decoration-accent/50 underline underline-offset-4">
              most nights I&apos;m still at the keyboard
            </strong>{" "}
            — some people wind down with Netflix, I wind down debugging my
            own side projects. 😉
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button href={SOCIAL.github} variant="ghost" icon={FaGithub}>
              GitHub
            </Button>
            <Button href={SOCIAL.linkedin} variant="ghost" icon={FaLinkedin}>
              LinkedIn
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
