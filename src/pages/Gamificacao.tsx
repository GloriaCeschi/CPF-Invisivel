import { LevelProgress } from "@/components/gamification/LevelProgress";
import { PointsFilter } from "@/components/gamification/PointsFilter";
import { ScoreContribution } from "@/components/gamification/ScoreContribution";
import { CourseList } from "@/components/gamification/CourseList";
import { LevelMap } from "@/components/gamification/LevelMap";
import { ActivityHistory } from "@/components/gamification/ActivityHistory";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

const Gamificacao = () => {
  const navigate = useNavigate();

  return (

    <DashboardLayout>
    <div className="min-h-screen bg-background">
      {/* Header */}
    <div className="flex items-center gap-3 p-5">

      <main className="w-full px-4 py-6 space-y-5 pb-20">
        <LevelProgress />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PointsFilter />
          <ScoreContribution />
        </div>
        <LevelMap />
        <CourseList />
        <ActivityHistory />
      </main>
    </div>
    </div>
    </DashboardLayout>
  );
};

export default Gamificacao;
