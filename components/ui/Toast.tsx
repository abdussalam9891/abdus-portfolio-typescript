"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTriangleExclamation, FaXmark } from "react-icons/fa6";
import { useReducedMotion } from "@/lib/reduced-motion";

interface ToastProps {
  message: string;
  variant?: "success" | "error";
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, variant = "success", onDismiss, duration = 5000 }: ToastProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  const Icon = variant === "success" ? FaCheck : FaTriangleExclamation;

  return (
    <motion.div
      role="status"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: reduced ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-accent/25 bg-background px-5 py-4 shadow-[0_18px_45px_-15px_rgb(0_0_0/0.9),0_0_30px_-10px_rgb(34_197_94/0.4)]"
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          variant === "success"
            ? "bg-accent/20 text-accent-bright"
            : "bg-red-500/15 text-red-500"
        }`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="mt-1.5 text-sm text-foreground">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-auto mt-1 shrink-0 text-foreground/40 transition-colors hover:text-accent-bright"
      >
        <FaXmark className="size-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
