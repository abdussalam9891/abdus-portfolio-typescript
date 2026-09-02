import Link from "next/link";
import type { IconType } from "react-icons";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: IconType;
}

/*
 * The hover sheen, lift, press and glow all live in `.btn-premium` and its
 * variants in app/globals.css — CSS rather than Framer Motion so this stays a
 * server component (it renders in the hero, on every card grid and in both
 * footers, and none of those needed to become client bundles for a hover
 * state). See the "Premium button" block there.
 */
const base =
  "btn-premium group/btn inline-flex items-center justify-center rounded-full px-5 py-3 md:px-6 text-sm font-medium";
const variants = {
  primary: "btn-primary",
  ghost: "btn-ghost",
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
      {Icon && (
        <Icon
          className="relative z-[2] size-4 shrink-0 transition-transform duration-300 ease-out group-hover/btn:-translate-y-px group-hover/btn:scale-110"
          aria-hidden="true"
        />
      )}
      <span className="relative z-[2]">{children}</span>
      <span aria-hidden="true" className="btn-shine" />
    </Link>
  );
}
