import type { Metadata } from "next";
import { PolicyContent } from "@/components/sections/PolicyContent";
import { PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy — Abdus Salam",
  description:
    "What this portfolio does and doesn't collect: no cookies, no analytics, and a contact form that only sends email.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 pt-8 md:pt-10 pb-10 text-center">
        <h1 className="text-gradient-accent text-4xl md:text-6xl font-semibold">
          Privacy policy
        </h1>
        <p className="mt-4 text-foreground/60">
          A straightforward account of the data this site uses, and the
          choices you have.
        </p>
        <p className="mt-2 text-sm text-foreground/40">
          Last updated: {PRIVACY_LAST_UPDATED}
        </p>
      </div>

      <PolicyContent sections={PRIVACY_SECTIONS} />
    </main>
  );
}
