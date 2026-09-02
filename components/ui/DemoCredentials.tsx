"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

interface DemoCredentialsProps {
  email: string;
  password: string;
  /**
   * Card-sized variant — one quiet line instead of the copyable panel, for
   * grids where a full block would drown the card's own copy.
   */
  compact?: boolean;
}

/**
 * Sign-in details for a demo account on a live site that sits behind a login,
 * so a visitor clicking through from a card doesn't dead-end on a login wall.
 *
 * Sits at `relative z-[2]` because the cards that host it use the
 * stretched-link pattern (see components/ui/LiveSiteLink.tsx) — without it the
 * overlay link swallows the text and the values can't be selected or copied.
 */
export function DemoCredentials({ email, password, compact = false }: DemoCredentialsProps) {
  if (compact) {
    return (
      <span className="relative z-[2] mt-2 block w-fit text-[11px] leading-relaxed text-foreground/45">
        Demo login{" "}
        <span className="text-foreground/70 select-all">{email}</span>
        <span className="text-foreground/30"> · </span>
        <span className="text-foreground/70 select-all">{password}</span>
      </span>
    );
  }

  return (
    <div className="relative z-[2] mx-auto mt-6 w-full max-w-md space-y-2 text-left">
      <p className="text-center text-[11px] uppercase tracking-widest text-foreground/40">
        Demo account
      </p>
      <CopyField label="Email" value={email} />
      <CopyField label="Password" value={password} />
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access is blocked in some browsers and insecure contexts.
      // The value is on screen and selectable either way, so there's nothing
      // to recover from here.
    }
  };

  return (
    <div className="surface-accent flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-widest text-foreground/40">
          {label}
        </span>
        <code className="block truncate text-sm text-foreground/85 select-all">
          {value}
        </code>
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.06] text-accent-bright transition-all duration-300 hover:border-accent/60 hover:bg-accent/15"
      >
        {copied ? (
          <FiCheck className="size-4" aria-hidden="true" />
        ) : (
          <FiCopy className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
