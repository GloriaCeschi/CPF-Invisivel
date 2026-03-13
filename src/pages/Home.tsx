import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ScoreCard } from "@/components/home/ScoreCard";
import { ScoreTipsCard } from "@/components/home/ScoreTipsCard";
import { GamificationCard } from "@/components/home/GamificationCard";
import { CreditAreaCard } from "@/components/home/CreditCard";
import { NoticesCard } from "@/components/home/NoticesCard";
import { CoursesSection } from "@/components/home/CoursesSection";
import { JourneySection } from "@/components/home/JourneySection";

const Home = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        {/* Top grid: Score + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScoreCard />
          <ScoreTipsCard />
        </div>

        {/* Middle grid: Gamification + Credit + Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GamificationCard />
          <CreditAreaCard />
          <NoticesCard />
        </div>

        {/* Courses section */}
        <CoursesSection />

        {/* Journey section */}
        <JourneySection />
      </div>
    </DashboardLayout>
  );
};

export default Home;
