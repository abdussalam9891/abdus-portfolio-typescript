"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp, staggerChildren } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-xl border border-foreground/15 bg-foreground/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-foreground/40";

export function ContactForm() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { error?: string } = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mt-10 max-w-2xl space-y-6"
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

      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        {status === "success" && (
          <span className="text-sm text-foreground/70">
            Thanks — I&apos;ll get back to you soon.
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-500">{errorMessage}</span>
        )}
      </motion.div>
    </motion.form>
  );
}
