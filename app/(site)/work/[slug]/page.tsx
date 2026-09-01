import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyGallery } from "@/components/case-study/CaseStudyGallery";
import { CaseStudySection } from "@/components/case-study/CaseStudyContent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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

      <CaseStudySection label="Problem">
        <p className="mt-4 text-lg text-foreground/80">{caseStudy.problem}</p>
      </CaseStudySection>

      <CaseStudySection label="Approach">
        <p className="mt-4 text-lg text-foreground/80">{caseStudy.approach}</p>
      </CaseStudySection>

      <CaseStudyGallery images={caseStudy.images} />

      <CaseStudySection label="Outcome">
        <p className="mt-4 text-lg text-foreground/80">{caseStudy.outcome}</p>
      </CaseStudySection>

      <CaseStudySection label="Tech stack">
        <div className="mt-4 flex flex-wrap gap-2">
          {caseStudy.techStack.map((tech) => (
            <Badge key={tech} icon={getSkillIcon(tech)}>
              {tech}
            </Badge>
          ))}
        </div>
      </CaseStudySection>

      {caseStudy.liveUrl && (
        <CaseStudySection label="Live link">
          <div className="mt-4">
            <Button href={caseStudy.liveUrl}>Visit {caseStudy.clientName}</Button>
          </div>
        </CaseStudySection>
      )}
    </main>
  );
}
