import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import EducationalSection from "@/components/home/EducationalSection";
import MarketplaceResults from "@/components/home/MarketplaceResults";
import WhyNowSection from "@/components/home/WhyNowSection";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <EducationalSection />
      <MarketplaceResults />
      <WhyNowSection />
    </>
  );
}
