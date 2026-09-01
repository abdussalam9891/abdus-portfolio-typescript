import type { IconType } from "react-icons";
import {
  SiExpress,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiResend,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";

// Only technologies with an official Simple Icons mark are listed here.
// Anything not found (e.g. Firecrawl, Recharts) falls back to plain text —
// no substitute/generic icon is used in place of a real brand mark.
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
};

export function getSkillIcon(name: string): IconType | undefined {
  return SKILL_ICON_MAP[name.trim().toLowerCase()];
}
