import type { IconType } from "react-icons";
import {
  SiClaudecode,
  SiCursor,
  SiExpress,
  SiGithubcopilot,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPostman,
  SiPrettier,
  SiReact,
  SiResend,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

// Only technologies with an official brand mark are listed here — Simple
// Icons for almost everything, plus VS Code's own product icon set (Simple
// Icons doesn't carry that mark). Anything without one (e.g. Firecrawl,
// Recharts, Thunder Client, Catppuccin) falls back to plain text; no
// substitute or generic icon is ever used in place of a real brand mark.
const SKILL_ICON_MAP: Record<string, IconType> = {
  react: SiReact,
  "react 19": SiReact,
  "next.js": SiNextdotjs,
  "tailwind css": SiTailwindcss,
  "tailwind css v4": SiTailwindcss,
  "shadcn/ui": SiShadcnui,
  supabase: SiSupabase,
  "node.js": SiNodedotjs,
  express: SiExpress,
  mongodb: SiMongodb,
  vite: SiVite,
  javascript: SiJavascript,
  "vanilla javascript": SiJavascript,
  typescript: SiTypescript,
  resend: SiResend,

  // Editor setup (/setup — see content/setup.ts). Keyed on the exact item
  // names used there, extension names included, so the lists stay readable
  // rather than being bent to match this map.
  "vs code": VscVscode,
  cursor: SiCursor,
  postman: SiPostman,
  prettier: SiPrettier,
  "npm intellisense": SiNpm,
  "tailwind css intellisense": SiTailwindcss,
  "es7+ react/redux snippets": SiReact,
  "react component generator": SiReact,
  "github copilot": SiGithubcopilot,
  "claude code": SiClaudecode,
};

export function getSkillIcon(name: string): IconType | undefined {
  return SKILL_ICON_MAP[name.trim().toLowerCase()];
}
