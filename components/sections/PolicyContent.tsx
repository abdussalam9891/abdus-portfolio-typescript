"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import type { PolicyBlock, PolicySection } from "@/content/privacy";

/**
 * Renders a policy from `content/privacy.ts`. Deliberately the lightest
 * motion treatment on the site: one reveal per section as it enters, and
 * nothing at all on the body copy (CLAUDE.md — a page someone is reading to
 * make a decision should not be fighting animation).
 */
export function PolicyContent({ sections }: { sections: PolicySection[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="px-6 md:px-10">
      <div className="mx-auto max-w-3xl">
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            className="border-t border-accent/15 py-10"
            initial={reduced ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p
              className="font-mono text-sm text-accent-bright/60"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-xl md:text-2xl font-semibold text-foreground/90">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-foreground/70">
              {section.blocks.map((block, blockIndex) => (
                <Block key={blockIndex} block={block} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

function Block({ block }: { block: PolicyBlock }) {
  if (block.kind === "list") {
    return (
      <ul className="space-y-2 list-disc list-outside pl-5 marker:text-accent">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p>
      {block.lead && (
        <span className="font-medium text-accent-bright/90">
          {block.lead}{" "}
        </span>
      )}
      {block.body}
    </p>
  );
}
