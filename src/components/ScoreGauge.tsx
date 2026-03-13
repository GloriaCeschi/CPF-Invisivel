import { useMemo } from "react";
import { getScoreLevel } from "@/data/mockData";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
}

export function ScoreGauge({ score, maxScore = 1000 }: ScoreGaugeProps) {
  const level = getScoreLevel(score);
  const percentage = score / maxScore;

  const { circumference, offset } = useMemo(() => {
    const radius = 90;
    const circ = 2 * Math.PI * radius;
    // We use 75% of the circle (270 degrees)
    const arcLength = circ * 0.75;
    const off = arcLength - arcLength * percentage;
    return { circumference: circ, offset: off, arcLength };
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-56 w-56">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          />
          {/* Score arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={level.color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-foreground">{score}</span>
          <span className="text-sm font-medium text-muted-foreground">de {maxScore}</span>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="rounded-full px-5 py-1.5 text-sm font-bold"
        style={{ backgroundColor: level.bgColor, color: level.color }}
      >
        {level.label}
      </div>

      {/* Level bar */}
      <div className="flex w-full max-w-xs gap-1">
        {[0, 1, 2, 3, 4].map((i) => {
          const lvl = [
            { color: "hsl(0, 84%, 60%)" },
            { color: "hsl(45, 93%, 56%)" },
            { color: "hsl(217, 91%, 60%)" },
            { color: "hsl(160, 84%, 39%)" },
            { color: "hsl(330, 82%, 60%)" },
          ][i];
          const active = Math.floor((score / maxScore) * 5) >= i + 1 || (i === 0 && score > 0);
          return (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor: active ? lvl.color : "hsl(var(--muted))",
                opacity: active ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
