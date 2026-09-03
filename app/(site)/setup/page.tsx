import type { Metadata } from "next";
import Link from "next/link";
import { SetupContent } from "@/components/sections/SetupContent";
import { SETUP_LAST_UPDATED, SETUP_SECTIONS } from "@/content/setup";
import { hasGearContent } from "@/content/gear";

export const metadata: Metadata = {
  title: "Setup — Abdus Salam",
  description:
    "The editor setup behind the work: IDEs, testing tools, themes, extensions, and AI assistants.",
};

export default function SetupPage() {
  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 pt-8 md:pt-10 pb-10 text-center">
        <p className="text-sm uppercase tracking-widest text-accent-bright/80">
          Setup
        </p>
        <h1 className="text-gradient-accent mt-4 text-4xl md:text-6xl font-semibold">
          What I build with
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70">
          My daily editor setup — IDEs, testing tools, themes, extensions, and
          the AI assistants I actually keep switched on.
          {hasGearContent && (
            <>
              {" "}
              For hardware and everyday software, see{" "}
              <Link
                href="/gear"
                className="link-underline text-accent-bright transition-colors duration-300 hover:text-accent-soft"
              >
                my gear
              </Link>
              .
            </>
          )}
        </p>
        <p className="mt-3 text-sm text-foreground/40">
          Last updated: {SETUP_LAST_UPDATED}
        </p>
      </div>

      <SetupContent sections={SETUP_SECTIONS} />
    </main>
  );
}
