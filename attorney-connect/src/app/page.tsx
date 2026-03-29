import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import EducationalSection from "@/components/home/EducationalSection";
import MarketplaceResults from "@/components/home/MarketplaceResults";
import HowItWorks from "@/components/home/HowItWorks";
import ForAttorneysCTA from "@/components/home/ForAttorneysCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <EducationalSection />
      <MarketplaceResults />
      <HowItWorks />
      <ForAttorneysCTA />
    </>
  );
}
