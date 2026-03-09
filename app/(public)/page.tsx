import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import PopularHeadhunters from "@/components/home/PopularHeadhunters";
import UserTypeTabs from "@/components/home/UserTypeTabs";
import LatestReviews from "@/components/home/LatestReviews";
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <PopularHeadhunters />
      <UserTypeTabs />
      <LatestReviews />
      <CtaSection />
    </>
  );
}
