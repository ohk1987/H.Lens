import HeroSection from "@/components/home/HeroSection";
import UserTypeTabs from "@/components/home/UserTypeTabs";
import MissionSection from "@/components/home/MissionSection";
import LatestReviews from "@/components/home/LatestReviews";
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <UserTypeTabs />
      <MissionSection />
      <LatestReviews />
      <CtaSection />
    </>
  );
}
