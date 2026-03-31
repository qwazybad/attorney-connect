import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import EducationalSection from "@/components/home/EducationalSection";
import MarketplaceResults from "@/components/home/MarketplaceResults";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <EducationalSection />
      <MarketplaceResults />
      <HowItWorks />
    </>
  );
}
