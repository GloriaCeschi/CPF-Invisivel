import { LevelProgress } from "@/components/gamification/LevelProgress";
import { PointsFilter } from "@/components/gamification/PointsFilter";
import { ScoreContribution } from "@/components/gamification/ScoreContribution";
import { CourseList } from "@/components/gamification/CourseList";
import { LevelMap } from "@/components/gamification/LevelMap";
import { ActivityHistory } from "@/components/gamification/ActivityHistory";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Gamificacao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background ">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="w-full flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h1 className="text-lg font-bold text-foreground">Gamificação</h1>
          </div>
        </div>
      </header>

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
  );
};

export default Gamificacao;
