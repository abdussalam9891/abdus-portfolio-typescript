import { Hero } from "@/components/sections/Hero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { getFeaturedCaseStudies } from "@/content/case-studies";

export default function HomePage() {
  const featured = getFeaturedCaseStudies();

  return (
    <main className="flex-1">
      <Hero />
      <WorkGrid caseStudies={featured} />
      <AboutTeaser />
      <ContactBlock />
    </main>
  );
}
