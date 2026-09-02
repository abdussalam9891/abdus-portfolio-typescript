import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyGallery } from "@/components/case-study/CaseStudyGallery";
import { CaseStudySection } from "@/components/case-study/CaseStudyContent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DemoCredentials } from "@/components/ui/DemoCredentials";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { getSkillIcon } from "@/lib/skill-icons";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) return {};

  return {
    title: `${caseStudy.clientName} — Case Study`,
    description: caseStudy.oneLiner,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="flex-1">
      <CaseStudyHero caseStudy={caseStudy} />

      <CaseStudySection label="Problem" center>
        <p className="mt-4 text-base sm:text-lg text-foreground/80 text-pretty">
          {caseStudy.problem}
        </p>
      </CaseStudySection>

      <CaseStudySection label="Approach" center>
        <p className="mt-4 text-base sm:text-lg text-foreground/80 text-pretty">
          {caseStudy.approach}
        </p>
      </CaseStudySection>

      <CaseStudyGallery images={caseStudy.images} />

      <CaseStudySection label="Outcome" center>
        <p className="mt-4 text-base sm:text-lg text-foreground/80 text-pretty">
          {caseStudy.outcome}
        </p>
      </CaseStudySection>

      <CaseStudySection label="Tech stack" center>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {caseStudy.techStack.map((tech) => (
            <Badge key={tech} icon={getSkillIcon(tech)}>
              {tech}
            </Badge>
          ))}
        </div>
      </CaseStudySection>

      {caseStudy.liveUrl && (
        <CaseStudySection label="Live link" center>
          <div className="mt-4 flex justify-center">
            <Button href={caseStudy.liveUrl}>Visit {caseStudy.clientName}</Button>
          </div>
          {caseStudy.liveNote && (
            <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/55 text-pretty">
              {caseStudy.liveNote}
            </p>
          )}
          {caseStudy.demoCredentials && (
            <DemoCredentials {...caseStudy.demoCredentials} />
          )}
        </CaseStudySection>
      )}
    </main>
  );
}
