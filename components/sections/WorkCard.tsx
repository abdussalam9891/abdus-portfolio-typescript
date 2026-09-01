"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { fadeUp } from "@/lib/motion";
import type { CaseStudy } from "@/content/case-studies";

export function WorkCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const image = caseStudy.images[0];

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/work/${caseStudy.slug}`}
        className="group block rounded-2xl border border-foreground/10 overflow-hidden hover:border-foreground/25 transition-colors"
      >
        <div className="relative aspect-[16/10] bg-foreground/5 flex items-center justify-center overflow-hidden">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-xs uppercase tracking-wide text-foreground/40">
              Screenshot coming soon
            </span>
          )}
        </div>
        <div className="p-5">
          <Badge>{caseStudy.category}</Badge>
          <h3 className="mt-3 text-lg font-medium">{caseStudy.clientName}</h3>
          <p className="mt-1 text-sm text-foreground/70">{caseStudy.oneLiner}</p>
        </div>
      </Link>
    </motion.div>
  );
}
