"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaWhatsapp, FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { CONTACT, SOCIAL } from "@/lib/contact";
import { BeamBorder } from "@/components/ui/BeamBorder";
import { ContactForm } from "@/components/sections/ContactForm";

interface ContactMethod {
  icon: IconType;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const methods: ContactMethod[] = [
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: CONTACT.phoneDisplay,
    href: CONTACT.whatsappHref,
    external: true,
  },
  {
    icon: FaPhone,
    label: "Call",
    value: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
];

const socials: { icon: IconType; label: string; href: string }[] = [
  { icon: FaGithub, label: "GitHub", href: SOCIAL.github },
  { icon: FaLinkedin, label: "LinkedIn", href: SOCIAL.linkedin },
  { icon: FaInstagram, label: "Instagram", href: SOCIAL.instagram },
  { icon: FaXTwitter, label: "X", href: SOCIAL.twitter },
];

export function ContactBlock() {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 py-16 md:py-24 border-t border-accent/15 text-center"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerChildren}
    >
      <motion.h2
        variants={fadeUp}
        className="text-gradient-accent text-2xl md:text-3xl font-semibold"
      >
        Let&apos;s talk about your project
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-foreground/70 max-w-xl mx-auto">
        Reach out directly, or drop a message below — I&apos;d love to hear from you.
      </motion.p>

      <motion.div
        variants={staggerChildren}
        className="mt-10 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto"
      >
        {methods.map(({ icon: Icon, label, value, href, external }) => (
          <motion.div key={label} variants={fadeUp}>
            <Link
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="surface-accent group relative flex items-center gap-4 rounded-2xl border bg-surface p-5 h-full hover:-translate-y-1"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent-bright transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-background group-hover:shadow-[0_0_22px_-4px_rgb(34_197_94/0.9)]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wide text-accent/70">
                  {label}
                </span>
                <span className="block truncate text-sm font-medium text-foreground">
                  {value}
                </span>
              </span>
              <BeamBorder hoverOnly glow duration={3.5} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <span className="text-xs uppercase tracking-wide text-foreground/50">
          Socials
        </span>
        <div className="flex items-center justify-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-full border border-accent/20 bg-accent/[0.04] text-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10 hover:text-accent-bright hover:shadow-[0_0_20px_-4px_rgb(34_197_94/0.7)]"
            >
              <Icon className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-16 border-t border-accent/15 pt-10 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold">Or send a message directly</h3>
        <ContactForm />
      </motion.div>
    </motion.section>
  );
}
