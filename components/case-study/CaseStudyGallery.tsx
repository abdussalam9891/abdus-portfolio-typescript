"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import type { CaseStudy } from "@/content/case-studies";

export function CaseStudyGallery({
  images,
}: {
  images: CaseStudy["images"];
}) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="px-6 md:px-10 py-10 border-t border-accent/15"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image) => (
            <div
              key={image.src}
              className="surface-accent group relative aspect-[16/10] overflow-hidden rounded-2xl border bg-accent/[0.04] hover:-translate-y-1"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="aspect-[16/9] rounded-2xl border border-accent/20 bg-accent/[0.04] flex items-center justify-center">
          <span className="text-xs uppercase tracking-wide text-foreground/40">
            Screenshots coming soon
          </span>
        </div>
      )}
    </motion.section>
  );
}
