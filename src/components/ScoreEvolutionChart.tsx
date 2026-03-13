import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { scoreHistory } from "@/data/mockData";
import { cn } from "@/lib/utils";

const filters = [
  { label: "3 meses", months: 3 },
  { label: "6 meses", months: 6 },
  { label: "1 ano", months: 12 },
];

export function ScoreEvolutionChart() {
  const [activeFilter, setActiveFilter] = useState(12);

  const data = useMemo(
    () => scoreHistory.slice(-activeFilter),
    [activeFilter]
  );

  const trend = data.length >= 2 ? data[data.length - 1].score - data[data.length - 2].score : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Evolução do Score</h3>
          <p className="text-sm text-muted-foreground">
            {trend >= 0 ? (
              <span className="text-success">▲ +{trend} pontos</span>
            ) : (
              <span className="text-destructive">▼ {trend} pontos</span>
            )}{" "}
            no último mês
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {filters.map((f) => (
            <button
              key={f.months}
              onClick={() => setActiveFilter(f.months)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                activeFilter === f.months
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(330, 82%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(330, 82%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 1000]}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
              labelStyle={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(330, 82%, 60%)"
              strokeWidth={3}
              fill="url(#scoreGradient)"
              dot={{ fill: "hsl(330, 82%, 60%)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(330, 82%, 60%)", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
