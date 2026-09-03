/**
 * Hardware and everyday software — the companion to content/setup.ts, which
 * covers the editor. Same `SetupSection` shape, so /gear renders through the
 * same component with no extra code.
 *
 * NOT YET WRITTEN. The page and the route exist, but the list is empty until
 * the real hardware is supplied — inventing a laptop model or a monitor the
 * author doesn't own is exactly the kind of fabrication CLAUDE.md rules out.
 * While `hasGearContent` is false the footer leaves the link out and the page
 * says plainly that it isn't written yet, so nothing ships half-finished.
 *
 * To fill it in: replace the empty array below with sections such as
 *
 *   { title: "Machine",  groups: [{ label: "Daily driver", items: [...] }] }
 *   { title: "Display",  groups: [{ label: "Desk",         items: [...] }] }
 *   { title: "Input",    groups: [{ label: "Keyboard & mouse", items: [...] }] }
 *   { title: "Audio",    groups: [{ label: "Headphones",   items: [...] }] }
 *   { title: "Everyday software", groups: [{ label: "Always open", items: [...] }] }
 *
 * and add a GEAR_LAST_UPDATED export mirroring SETUP_LAST_UPDATED.
 */

import type { SetupSection } from "@/content/setup";

export const GEAR_SECTIONS: SetupSection[] = [];

/**
 * Whether the list above has anything in it. Read by the footer (to decide
 * whether /gear is worth linking) and by /setup (to decide whether to point
 * at it), so filling in GEAR_SECTIONS is the only step needed to publish it.
 */
export const hasGearContent = GEAR_SECTIONS.length > 0;
