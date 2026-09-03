/**
 * Whether the site has a background track at all, in one place.
 *
 * The URL is inlined at build time (NEXT_PUBLIC_*), so this is a constant in
 * the bundle, not a runtime check: with the var unset the player never
 * reaches the browser, and the layout that makes room for it doesn't either.
 * Both facts have to agree, hence the shared module — see CLAUDE.md,
 * "Background audio".
 */

export const AMBIENT_TRACK_SRC = process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL;

export const hasAmbientTrack = Boolean(AMBIENT_TRACK_SRC);

/**
 * Bottom padding a page's last block needs so the fixed player doesn't sit
 * on top of it. The player is `bottom-5` + 44px tall on mobile and
 * `bottom-6` on `sm` up, so it eats ~64–68px from the bottom of the
 * viewport; these leave that plus a gap. Applied as the *only* padding-bottom
 * utility on the element, so there's no Tailwind conflict to resolve.
 */
export const AMBIENT_DOCK_CLEARANCE = "pb-28 sm:pb-24";
