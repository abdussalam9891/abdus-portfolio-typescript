import { FiExternalLink } from "react-icons/fi";

interface LiveSiteLinkProps {
  href: string;
  clientName: string;
  className?: string;
}

/**
 * Direct link to a deployed project, for use inside a card whose whole
 * surface already links to the case study.
 *
 * Those cards use the stretched-link pattern — an absolutely positioned
 * overlay `<Link>` at `z-[1]` covering the card — precisely so this can be a
 * sibling of that link rather than an anchor nested inside one. It has to
 * paint above the overlay to stay clickable, hence `relative z-[2]`.
 */
export function LiveSiteLink({ href, clientName, className = "" }: LiveSiteLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the live ${clientName} site in a new tab`}
      className={`relative z-[2] inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/[0.08] px-3 py-1.5 text-xs font-medium text-accent-bright backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:bg-accent/15 hover:shadow-[0_0_16px_-4px_rgb(34_197_94/0.6)] ${className}`}
    >
      <FiExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
      Live site
    </a>
  );
}
