import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import EducationalSection from "@/components/home/EducationalSection";
import MarketplaceResults from "@/components/home/MarketplaceResults";
import ForAttorneysCTA from "@/components/home/ForAttorneysCTA";
import WhyNowSection from "@/components/home/WhyNowSection";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <EducationalSection />
      <MarketplaceResults />
      <ForAttorneysCTA />
      <WhyNowSection />
    </>
  );
}
