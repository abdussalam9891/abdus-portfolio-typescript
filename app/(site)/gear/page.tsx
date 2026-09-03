import type { Metadata } from "next";
import Link from "next/link";
import { SetupContent } from "@/components/sections/SetupContent";
import { GEAR_SECTIONS, hasGearContent } from "@/content/gear";

export const metadata: Metadata = {
  title: "Gear — Abdus Salam",
  description:
    "The hardware and everyday software behind the work — the desk side of the editor setup.",
};

export default function GearPage() {
  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 pt-8 md:pt-10 pb-10 text-center">
        <p className="text-sm uppercase tracking-widest text-accent-bright/80">
          Gear
        </p>
        <h1 className="text-gradient-accent mt-4 text-4xl md:text-6xl font-semibold">
          The desk
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70">
          Hardware and everyday software. For the editor itself — themes,
          extensions, assistants — see{" "}
          <Link
            href="/setup"
            className="link-underline text-accent-bright transition-colors duration-300 hover:text-accent-soft"
          >
            my setup
          </Link>
          .
        </p>
      </div>

      {hasGearContent ? (
        <SetupContent sections={GEAR_SECTIONS} />
      ) : (
        // content/gear.ts is still empty, so this page is unlinked from the
        // footer. Say so plainly rather than shipping an invented list.
        <p className="mx-auto max-w-2xl px-6 md:px-10 text-center text-foreground/50">
          Still writing this one up.
        </p>
      )}
    </main>
  );
}
