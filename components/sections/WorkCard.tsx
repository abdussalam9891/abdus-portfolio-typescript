"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { BeamBorder } from "@/components/ui/BeamBorder";
import { DemoCredentials } from "@/components/ui/DemoCredentials";
import { LiveSiteLink } from "@/components/ui/LiveSiteLink";
import { fadeUp } from "@/lib/motion";
import type { CaseStudy } from "@/content/case-studies";

export function WorkCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const image = caseStudy.images[0];

  return (
    <motion.div variants={fadeUp} className="h-full">
      {/*
       * A div with a stretched overlay link rather than one wrapping <a>:
       * the live-site link has to be a sibling of the case-study link, not
       * an anchor nested inside one.
       */}
      <div className="surface-accent group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface hover:-translate-y-1.5">
        <Link
          href={`/work/${caseStudy.slug}`}
          aria-label={`Read the ${caseStudy.clientName} case study`}
          className="absolute inset-0 z-[1] rounded-2xl"
        />
        <div className="relative aspect-[4/3] bg-accent/[0.06] flex items-center justify-center overflow-hidden">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <span className="text-xs uppercase tracking-wide text-foreground/40">
              Screenshot coming soon
            </span>
          )}
          {/* Always-on scrim keeps the thumbnails in the page's palette;
              the green half only resolves on hover. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-deep/35 via-transparent to-accent/20 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <Badge>{caseStudy.category}</Badge>
          <h3 className="mt-3 flex items-center gap-1.5 text-base font-medium transition-colors duration-300 group-hover:text-accent-bright">
            {caseStudy.clientName}
            <span className="translate-x-0 text-accent/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-bright">
              →
            </span>
          </h3>
          <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
            {caseStudy.oneLiner}
          </p>
          {caseStudy.liveUrl && (
            <div className="mt-auto pt-4">
              <LiveSiteLink
                href={caseStudy.liveUrl}
                clientName={caseStudy.clientName}
              />
              {/* Clamped here, in full on the case study page — a card
                  shouldn't grow a paragraph over a caveat. */}
              {caseStudy.liveNote && (
                <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-foreground/45">
                  {caseStudy.liveNote}
                </p>
              )}
              {caseStudy.demoCredentials && (
                <DemoCredentials {...caseStudy.demoCredentials} compact />
              )}
            </div>
          )}
        </div>
        <BeamBorder hoverOnly glow duration={3.5} />
      </div>
    </motion.div>
  );
}
