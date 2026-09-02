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

  /*
   * Most case studies ship a single screenshot. Left in a two-column grid a
   * lone image sits in the left half and reads as misaligned against the
   * centred copy above it, so a single image gets its own narrower centred
   * column instead — and on an odd count the trailing image spans both
   * columns and centres, rather than leaving a hole on the right.
   */
  const isSingle = images.length === 1;
  const hasOrphan = images.length > 1 && images.length % 2 === 1;

  return (
    <motion.section
      className="px-6 md:px-10 py-10 border-t border-accent/15"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <div className="mx-auto max-w-5xl">
        {images.length > 0 ? (
          <div
            className={
              isSingle
                ? "mx-auto w-full max-w-3xl"
                : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            }
          >
            {images.map((image, index) => {
              const isOrphan = hasOrphan && index === images.length - 1;

              return (
                <div
                  key={image.src}
                  className={`surface-accent group relative aspect-[16/10] overflow-hidden rounded-2xl border bg-accent/[0.04] hover:-translate-y-1 ${
                    isOrphan ? "md:col-span-2 md:mx-auto md:w-full md:max-w-2xl" : ""
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={
                      isSingle
                        ? "(min-width: 768px) 768px, 100vw"
                        : "(min-width: 1024px) 512px, (min-width: 768px) 50vw, 100vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto aspect-[16/9] w-full max-w-3xl rounded-2xl border border-accent/20 bg-accent/[0.04] flex items-center justify-center">
            <span className="text-xs uppercase tracking-wide text-foreground/40">
              Screenshots coming soon
            </span>
          </div>
        )}
      </div>
    </motion.section>
  );
}
