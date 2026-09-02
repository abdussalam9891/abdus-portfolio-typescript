import { Hero } from "@/components/sections/Hero";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { getFeaturedCaseStudies } from "@/content/case-studies";

export default function HomePage() {
  const featured = getFeaturedCaseStudies();

  return (
    <main className="flex-1">
      <Hero />
      <WorkShowcase caseStudies={featured} />
      <AboutTeaser />
      <ContactBlock />
    </main>
  );
}
