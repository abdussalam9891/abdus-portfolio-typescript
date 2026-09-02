"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/reduced-motion";
import { fadeUp } from "@/lib/motion";
import type { ContributionDay, GithubContributions } from "@/lib/github";

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "var(--gh-level-0)",
  1: "var(--gh-level-1)",
  2: "var(--gh-level-2)",
  3: "var(--gh-level-3)",
  4: "var(--gh-level-4)",
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAY_ROW_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

type Week = (ContributionDay | null)[];

function buildWeeks(days: ContributionDay[]): Week[] {
  const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: Week = [...Array(firstWeekday).fill(null), ...days];

  const weeks: Week[] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

function getMonthLabels(weeks: Week[]) {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  let lastLabelWeekIndex = -Infinity;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((day) => day !== null);
    if (!firstDay) return;
    const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();
    // Skip a label that would crowd the previous one (each column is ~13px,
    // a 3-letter month label needs ~2 columns of clearance).
    if (month !== lastMonth && weekIndex - lastLabelWeekIndex >= 2) {
      labels.push({ weekIndex, label: MONTH_NAMES[month] });
      lastMonth = month;
      lastLabelWeekIndex = weekIndex;
    } else if (month !== lastMonth) {
      lastMonth = month;
    }
  });

  return labels;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function GithubActivity({
  username,
  data,
}: {
  username: string;
  data: GithubContributions;
}) {
  const reduced = useReducedMotion();
  const weeks = buildWeeks(data.days);
  const monthLabels = getMonthLabels(weeks);

  return (
    <motion.div
      className="mt-4"
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <p className="text-lg text-foreground/80">
        Total: <span className="text-accent-glow font-medium">{data.total}</span>{" "}
        contributions in the last year
      </p>

      <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
        <div className="flex shrink-0 flex-col gap-[3px] pt-[18px] text-xs text-foreground/50">
          {Array.from({ length: 7 }).map((_, day) => (
            <div key={day} className="h-[10px] leading-[10px]">
              {WEEKDAY_ROW_LABELS[day] ?? ""}
            </div>
          ))}
        </div>

        <div className="shrink-0">
          <div className="flex gap-[3px] text-xs text-foreground/50">
            {weeks.map((_, weekIndex) => (
              <div key={weekIndex} className="w-[10px] shrink-0 whitespace-nowrap">
                {monthLabels.find((m) => m.weekIndex === weekIndex)?.label ?? ""}
              </div>
            ))}
          </div>

          <div className="mt-1 flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) =>
                  day ? (
                    <div
                      key={dayIndex}
                      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                    />
                  ) : (
                    <div key={dayIndex} className="h-[10px] w-[10px]" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-foreground/60 underline decoration-accent/40 underline-offset-4 transition-colors duration-300 hover:text-accent-bright"
        >
          @{username} on GitHub
        </a>

        <div className="flex items-center gap-1 text-xs text-foreground/50">
          Less
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div
              key={level}
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: LEVEL_COLORS[level] }}
            />
          ))}
          More
        </div>
      </div>
    </motion.div>
  );
}
