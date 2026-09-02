import type { Metadata } from "next";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { CaseStudySection } from "@/components/case-study/CaseStudyContent";
import { Badge } from "@/components/ui/Badge";
import { GithubActivity } from "@/components/sections/GithubActivity";
import { getGithubContributions } from "@/lib/github";
import { getSkillIcon } from "@/lib/skill-icons";

const GITHUB_USERNAME = "abdussalam9891";

export const metadata: Metadata = {
  title: "About — Abdus Salam",
  description:
    "Full-stack developer based in New Delhi, India — skills, education, and experience.",
};

const SKILL_GROUPS = [
  {
    label: "Frontend & full-stack",
    skills: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "Supabase"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    label: "Also worked with",
    skills: ["Vite", "Vanilla JavaScript"],
  },
];

export default async function AboutPage() {
  const contributions = await getGithubContributions(GITHUB_USERNAME);

  return (
    <main className="flex-1">
      <AboutIntro />

      <CaseStudySection label="Skills" center>
        <div className="mt-4 space-y-6">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm text-accent/70">{group.label}</h3>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {group.skills.map((skill) => (
                  <Badge key={skill} icon={getSkillIcon(skill)}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection label="Education" center>
        <p className="mt-4 text-lg text-foreground/80">
          <span className="text-accent-bright">
            Bachelor of Technology in Electronics &amp; Communication
            Engineering
          </span>{" "}
          (2021 – 2025)
        </p>
        <p className="mt-1 text-foreground/60">
          Deenbandhu Chhotu Ram University of Science &amp; Technology,
          Haryana
        </p>
      </CaseStudySection>

      <CaseStudySection label="Experience" center>
        <div className="mt-4 flex flex-col items-center">
          <p className="text-lg font-medium text-foreground/90">
            <span className="text-accent-bright">
              Full Stack Developer Intern
            </span>{" "}
            — Fuel It Online (Imperial Milestone Pvt. Ltd.)
          </p>
          <p className="text-sm text-foreground/50 whitespace-nowrap">
            Mar 2026 – Present
          </p>
          <p className="text-sm text-foreground/50">Jaipur, India (Hybrid)</p>
          <ul className="mt-4 max-w-xl mx-auto space-y-2 text-left text-foreground/80 list-disc list-inside">
            <li>
              Sole full-stack owner of Gemora, a jewelry e-commerce platform.
            </li>
            <li>
              Conducted a self-initiated audit across all three repositories,
              finding and fixing structural issues including duplicate
              authentication logic and unoptimized asset delivery.
            </li>
            <li>
              Independently built the frontend for Banshiwale, a
              men&apos;s jewelry client website, while a teammate handled
              the backend.
            </li>
          </ul>
        </div>
      </CaseStudySection>

      {contributions && (
        <CaseStudySection label="GitHub Activity" center>
          <GithubActivity username={GITHUB_USERNAME} data={contributions} />
        </CaseStudySection>
      )}
    </main>
  );
}
