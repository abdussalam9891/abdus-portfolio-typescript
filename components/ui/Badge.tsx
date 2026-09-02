import type { IconType } from "react-icons";
import type { ReactNode } from "react";

interface BadgeProps {
  icon?: IconType;
  /**
   * "accent" fills the pill with a green tint and green text — for the one
   * badge that should carry weight in a group. "subtle" (the default) keeps
   * a green rim over the page ground so a wall of them stays quiet.
   */
  variant?: "subtle" | "accent";
  children: ReactNode;
}

export function Badge({ icon: Icon, variant = "subtle", children }: BadgeProps) {
  const styles =
    variant === "accent"
      ? "border-accent/40 bg-accent/10 text-accent-bright hover:border-accent/70 hover:bg-accent/15"
      : "border-accent/20 bg-accent/[0.04] text-foreground/70 hover:border-accent/45 hover:text-accent-soft";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition-colors duration-300 ${styles}`}
    >
      {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}
