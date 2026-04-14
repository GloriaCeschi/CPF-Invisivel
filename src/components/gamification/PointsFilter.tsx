import { useProfile } from "@/hooks/useProfile";

const PERIODS = [
  { key: "total", label: "Total", days: Infinity },
] as const;

export const PointsFilter = () => {
  const { profile, loading } = useProfile();

  if (loading || !profile) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-24 mb-3"></div>
          <div className="h-8 bg-muted rounded w-16 mb-2"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      </div>
    );
  }

  const totalPoints = profile.points || 0;

  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Pontos Totais</h3>
      <div className="text-center">
        <p className="text-5xl font-extrabold text-primary">{totalPoints}</p>
        <p className="text-base text-muted-foreground">pontos acumulados</p>
      </div>
    </div>
  );
};
