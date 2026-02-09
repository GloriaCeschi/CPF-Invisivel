import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import DataProofSection from "@/components/landing/DataProofSection";
import PainSection from "@/components/landing/PainSection";
import SolutionSection from "@/components/landing/SolutionSection";
import QuizSection from "@/components/landing/QuizSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import EducationSection from "@/components/landing/EducationSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection />
      <DataProofSection />
      <PainSection />
      <SolutionSection />
      <QuizSection />
      <SocialProofSection />
      <EducationSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
