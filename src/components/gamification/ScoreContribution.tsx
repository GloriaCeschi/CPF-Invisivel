import { Progress } from "@/components/ui/progress";
import { USER_MOCK } from "@/data/gamificationData";
import { TrendingUp } from "lucide-react";

export const ScoreContribution = () => {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-success/15 p-2">
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Impacto no Score</h3>
      </div>
      <p className="text-lg font-bold text-foreground mb-1">
        +{USER_MOCK.scoreContribution} pontos <span className="text-sm font-normal text-muted-foreground">de score esta semana</span>
      </p>
      <div className="flex items-center gap-3 mt-3">
        <Progress value={(USER_MOCK.scoreTotal / 100) * 100} className="h-3 flex-1 bg-secondary [&>div]:bg-success" />
        <span className="text-sm font-semibold text-success">{USER_MOCK.scoreTotal}/100</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Suas atividades de gamificação contribuem diretamente para o seu Score Alternativo.</p>
    </div>
  );
};
