import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { TrendingUp } from "lucide-react";

export const ScoreContribution = () => {
  const { profile, loading } = useProfile();

  if (loading || !profile) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-6 bg-muted rounded w-24"></div>
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-16"></div>
        </div>
      </div>
    );
  }

  const totalPoints = profile.points || 0;
  // Assuming score is points / 10, capped at 100
  const scoreTotal = Math.min(Math.floor(totalPoints / 10), 100);
  const scoreContribution = Math.floor(totalPoints / 10); // Weekly contribution, for now using total

  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-success/15 p-2">
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Impacto no Score</h3>
      </div>
      <p className="text-lg font-bold text-foreground mb-1">
        +{scoreContribution} pontos <span className="text-sm font-normal text-muted-foreground">de score esta semana</span>
      </p>
      <div className="flex items-center gap-3 mt-3">
        <Progress value={scoreTotal} className="h-3 flex-1 bg-secondary [&>div]:bg-success" />
        <span className="text-sm font-semibold text-success">{scoreTotal}/100</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Suas atividades de gamificação contribuem diretamente para o seu Score Alternativo.</p>
    </div>
  );
};
