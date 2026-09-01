import type { CaseStudy } from "./types";
import { reisagri } from "./reisagri";
import { romanEnterprises } from "./roman-enterprises";
import { bharatbhramana } from "./bharatbhramana";
import { dropwatch } from "./dropwatch";
import { gemoraStorefront } from "./gemora-storefront";
import { gemoraDashboard } from "./gemora-dashboard";

export type { CaseStudy };

export const caseStudies: CaseStudy[] = [
  reisagri,
  romanEnterprises,
  bharatbhramana,
  dropwatch,
  gemoraStorefront,
  gemoraDashboard,
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((caseStudy) => caseStudy.featured);
}
