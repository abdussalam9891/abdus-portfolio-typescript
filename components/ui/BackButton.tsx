import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

/**
 * Takes the visitor back to the home page. Deliberately a `Link` to `/`
 * rather than `router.back()`: history could point anywhere (a case study,
 * an external referrer), and "back" here should always mean the same place.
 */
export function BackButton() {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      title="Back to home"
      className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.05] text-foreground transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent-bright hover:shadow-[0_0_18px_-4px_rgb(34_197_94/0.6)]"
    >
      <FiArrowLeft
        size={18}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-x-0.5"
      />
    </Link>
  );
}
