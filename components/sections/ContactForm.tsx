"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { BeamBorder } from "@/components/ui/BeamBorder";
import { Toast } from "@/components/ui/Toast";

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-xl border border-accent/20 bg-accent/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-all duration-300 hover:border-accent/35 focus:border-accent/70 focus:bg-accent/[0.06] focus:shadow-[0_0_22px_-8px_rgb(34_197_94/0.8)]";

export function ContactForm() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [toastMessage, setToastMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { error?: string } = await res.json();

      if (!res.ok) {
        setStatus("error");
        setToastMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setToastMessage(
        `Thanks, ${payload.firstName}! Your message is on its way — I'll get back to you soon.`
      );
      form.reset();
    } catch {
      setStatus("error");
      setToastMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mt-10 space-y-6 text-left"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerChildren}
    >
      <motion.div variants={fadeUp} className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">First name</span>
          <input
            name="firstName"
            type="text"
            required
            placeholder="Name"
            className={inputClasses}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Last name</span>
          <input name="lastName" type="text" placeholder="Surname" className={inputClasses} />
        </label>
      </motion.div>

      <motion.label variants={fadeUp} className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputClasses}
        />
      </motion.label>

      <motion.label variants={fadeUp} className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Your message"
          className={`${inputClasses} resize-none`}
        />
      </motion.label>

      <motion.div variants={fadeUp} className="flex justify-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-premium btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="relative z-[2]">
            {status === "submitting" ? "Sending…" : "Send message"}
          </span>
          <span aria-hidden="true" className="btn-shine" />
          <BeamBorder glow width={2} duration={3} color="var(--accent-soft)" />
        </button>
      </motion.div>

      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <Toast
            key={status}
            message={toastMessage}
            variant={status === "success" ? "success" : "error"}
            onDismiss={() => setStatus("idle")}
          />
        )}
      </AnimatePresence>
    </motion.form>
  );
}
