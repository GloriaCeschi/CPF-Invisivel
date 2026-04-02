import { LEVELS } from "@/data/gamificationData";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";

export const LevelMap = () => {
  const { profile, loading } = useProfile();

  if (loading || !profile) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalPoints = profile.points || 0;
  const currentLevelIndex = LEVELS.findIndex(level => totalPoints < level.minPoints) - 1;
  const currentLevel = Math.max(1, currentLevelIndex + 1);

  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Sistema de Níveis</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {LEVELS.map((lvl) => {
          const isCurrent = lvl.level === currentLevel;
          const isPast = lvl.level < currentLevel;
          const isFuture = lvl.level > currentLevel;

          return (
            <div
              key={lvl.level}
              className={`flex flex-col items-center rounded-xl p-3 text-center transition-all ${
                isCurrent
                  ? "bg-primary/10 border-2 border-primary shadow-md scale-105"
                  : isPast
                  ? "bg-success/10 border border-success/30"
                  : "bg-muted/40 border border-border"
              }`}
            >
              <span className="text-2xl mb-1">{lvl.icon}</span>
              <p className={`text-xs font-bold ${isCurrent ? "text-primary" : isPast ? "text-success" : "text-muted-foreground"}`}>
                Nível {lvl.level}
              </p>
              <p className={`text-[10px] ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>{lvl.name}</p>
              {isFuture && (
                <Badge variant="outline" className="mt-1 text-[9px] px-1.5 py-0">
                  {lvl.minPoints} pts
                </Badge>
              )}
              {isCurrent && (
                <Badge className="mt-1 text-[9px] px-1.5 py-0 bg-primary text-primary-foreground">Atual</Badge>
              )}
              {isPast && (
                <Badge className="mt-1 text-[9px] px-1.5 py-0 bg-success text-success-foreground">✓</Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
