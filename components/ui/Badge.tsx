import type { IconType } from "react-icons";
import type { ReactNode } from "react";

export function Badge({
  icon: Icon,
  children,
}: {
  icon?: IconType;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1 text-xs uppercase tracking-wide text-foreground/70">
      {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}
