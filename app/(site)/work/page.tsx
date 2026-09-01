import type { Metadata } from "next";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { caseStudies } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Work — Abdus Salam",
  description:
    "Case studies from client and product work — B2B sites, e-commerce, and solo-built products, shipped end to end.",
};

export default function WorkPage() {
  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 pt-28 md:pt-36">
        <h1 className="text-4xl md:text-6xl font-semibold">Work</h1>
        <p className="mt-4 text-lg text-foreground/70 max-w-2xl">
          Case studies from freelance client work and solo-built products.
        </p>
      </div>
      <WorkGrid caseStudies={caseStudies} title="All case studies" />
    </main>
  );
}
