import CaseStudyIntro from "@/components/CaseStudyIntro";
import CoverflowHero from "@/components/CoverflowHero";
import IndustryMarquee from "@/components/IndustryMarquee";
import OurWorkShowcase from "@/components/OurWorkShowcase";
import ServicesList from "@/components/ServicesList";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <CoverflowHero />
      <CaseStudyIntro />
      <IndustryMarquee />
      <ServicesList />
      <OurWorkShowcase />
    </main>
  );
}
