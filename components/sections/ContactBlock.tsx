"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaWhatsapp, FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { CONTACT, SOCIAL } from "@/lib/contact";
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
      className="px-6 md:px-10 py-16 md:py-24 border-t border-foreground/10"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerChildren}
    >
      <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-semibold">
        Let&apos;s talk about your project
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-foreground/70 max-w-xl">
        Reach out directly, or drop a message below — I&apos;d love to hear from you.
      </motion.p>

      <motion.div
        variants={staggerChildren}
        className="mt-10 grid gap-4 sm:grid-cols-3"
      >
        {methods.map(({ icon: Icon, label, value, href, external }) => (
          <motion.div key={label} variants={fadeUp}>
            <Link
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl border border-foreground/10 p-5 h-full transition-colors hover:border-foreground/30 hover:bg-foreground/[0.03]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/80 transition-colors group-hover:bg-foreground group-hover:text-background">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wide text-foreground/50">
                  {label}
                </span>
                <span className="block truncate text-sm font-medium text-foreground">
                  {value}
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
        <span className="text-xs uppercase tracking-wide text-foreground/50">
          Socials
        </span>
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-full border border-foreground/10 text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-16 border-t border-foreground/10 pt-10">
        <h3 className="text-xl font-semibold">Or send a message directly</h3>
        <ContactForm />
      </motion.div>
    </motion.section>
  );
}
