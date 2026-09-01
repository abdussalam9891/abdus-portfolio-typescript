import Link from "next/link";
import type { IconType } from "react-icons";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: IconType;
}

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors";
const variants = {
  primary: "bg-foreground text-background hover:opacity-90",
  ghost:
    "border border-foreground/20 text-foreground hover:border-foreground/40",
};

export function Button({
  href,
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  ...rest
}: ButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("https://wa.me");

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${Icon ? "gap-2" : ""} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
      {children}
    </Link>
  );
}
