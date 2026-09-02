import type { CSSProperties } from "react";

interface BeamBorderProps {
  /** Beam colour — any CSS colour. Defaults to the emerald accent. */
  color?: string;
  /** Ring thickness in px. */
  width?: number;
  /** Seconds for one full lap of the perimeter. */
  duration?: number;
  /** Length of the comet as a fraction of the perimeter (0–0.5). */
  arc?: number;
  /** Adds a blurred copy underneath for a soft bloom. */
  glow?: boolean;
  /** Fades the beam in only while the nearest `group` ancestor is hovered. */
  hoverOnly?: boolean;
  className?: string;
}

/**
 * Decorative light that travels around the perimeter of its parent.
 *
 * Drop it as the last child of any element that is `relative` and has a
 * border-radius — the beam inherits that radius and covers the full box:
 *
 *   <div className="relative rounded-2xl …">
 *     …
 *     <BeamBorder />
 *   </div>
 *
 * Purely presentational: `aria-hidden`, no pointer events, and it collapses to
 * a static ring under `prefers-reduced-motion` (see app/globals.css).
 */
export function BeamBorder({
  color = "#22c55e",
  width = 1,
  duration = 4,
  arc = 0.12,
  glow = false,
  hoverOnly = false,
  className = "",
}: BeamBorderProps) {
  const style = {
    "--beam-color": color,
    "--beam-width": `${width}px`,
    "--beam-duration": `${duration}s`,
    "--beam-arc": `${arc}turn`,
  } as CSSProperties;

  const visibility = hoverOnly
    ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    : "";

  return (
    <>
      {glow && (
        <span
          aria-hidden="true"
          className={`beam-border beam-border--glow ${visibility} ${className}`}
          style={style}
        />
      )}
      <span
        aria-hidden="true"
        className={`beam-border ${visibility} ${className}`}
        style={style}
      />
    </>
  );
}
