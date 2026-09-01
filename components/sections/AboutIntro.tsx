"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { SOCIAL } from "@/lib/contact";

export function AboutIntro() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 pt-28 pb-12 md:pt-36 md:pb-16"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={staggerChildren}
    >
      <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-16">
        <div className="flex-1">
          <motion.p
            variants={fadeUp}
            className="text-sm uppercase tracking-widest text-foreground/60 mb-6"
          >
            About
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-semibold max-w-3xl"
          >
            Abdus Salam
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-foreground/70 max-w-2xl"
          >
            I&apos;m a full-stack dev based in New Delhi. I build things{" "}
            <strong className="font-semibold text-foreground">
              start to finish
            </strong>{" "}
            — design, code, database, deployment, the whole thing — instead
            of just one slice of the stack.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-foreground/70 max-w-2xl"
          >
            I&apos;ve built a{" "}
            <strong className="font-semibold text-foreground">
              jewelry store
            </strong>{" "}
            with real payments and OTP login, and a{" "}
            <strong className="font-semibold text-foreground">
              price-tracker
            </strong>{" "}
            that scrapes sites and pings you the second something drops.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-foreground/70 max-w-2xl"
          >
            Day job&apos;s hybrid, but{" "}
            <strong className="font-semibold text-foreground underline underline-offset-4">
              most nights I&apos;m still at the keyboard
            </strong>{" "}
            — some people wind down with Netflix, I wind down debugging my
            own side projects. 😉
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <Button href={SOCIAL.github} variant="ghost" icon={FaGithub}>
              GitHub
            </Button>
            <Button href={SOCIAL.linkedin} variant="ghost" icon={FaLinkedin}>
              LinkedIn
            </Button>
          </motion.div>
        </div>
        <motion.div
          variants={fadeUp}
          className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden bg-foreground/5"
        >
          <Image
            src="/images/about/abdus-salam.png"
            alt="Portrait of Abdus Salam"
            fill
            sizes="(min-width: 768px) 224px, 160px"
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
