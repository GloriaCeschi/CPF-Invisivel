import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACTIVITIES } from "@/data/gamificationData";

const PERIODS = [
  { key: "week", label: "Esta Semana", days: 7 },
  { key: "biweek", label: "15 dias", days: 15 },
  { key: "month", label: "Este Mês", days: 30 },
  { key: "all", label: "Total", days: Infinity },
] as const;

export const PointsFilter = () => {
  const [period, setPeriod] = useState<string>("week");

  const selected = PERIODS.find((p) => p.key === period)!;
  const now = new Date("2026-03-06");
  const cutoff = new Date(now);
  if (selected.days !== Infinity) cutoff.setDate(cutoff.getDate() - selected.days);

  const filtered = selected.days === Infinity
    ? ACTIVITIES
    : ACTIVITIES.filter((a) => new Date(a.date) >= cutoff);

  const totalPts = filtered.reduce((s, a) => s + a.points, 0);

  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Pontos por período</h3>
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="w-full bg-secondary">
          {PERIODS.map((p) => (
            <TabsTrigger key={p.key} value={p.key} className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-4 text-center">
        <p className="text-4xl font-extrabold text-primary">{totalPts}</p>
        <p className="text-sm text-muted-foreground">pontos ganhos</p>
      </div>
    </div>
  );
};
