"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import { getSkillIcon } from "@/lib/skill-icons";
import type { SetupSection } from "@/content/setup";

/**
 * Renders a tool list from `content/setup.ts` (or `content/gear.ts`, which
 * shares the shape). Light motion, in the spirit of PolicyContent: one
 * reveal per card as it enters and nothing on the items themselves — this is
 * a reference page people scan, not a showpiece.
 */
export function SetupContent({ sections }: { sections: SetupSection[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="px-6 md:px-10 pb-4">
      {/* items-start so a short card (Testing) doesn't stretch to match a
          tall one (Extensions) sitting beside it. */}
      <div className="mx-auto grid max-w-5xl items-start gap-5 md:grid-cols-2">
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            className="surface-accent rounded-2xl border p-6"
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
            <h2 className="mt-2 text-xl font-semibold text-foreground/90">
              {section.title}
            </h2>

            <div className="mt-5 space-y-5">
              {section.groups.map((group) => (
                <div key={group.label}>
                  <h3 className="text-sm text-accent/70">{group.label}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item.name} icon={getSkillIcon(item.name)}>
                        {item.name}
                        {item.note && (
                          <span className="normal-case text-foreground/40">
                            ({item.note})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
