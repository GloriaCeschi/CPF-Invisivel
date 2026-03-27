import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { scoreFactors, achievements } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap = {
  positive: CheckCircle2,
  negative: AlertTriangle,
  tip: Lightbulb,
};

const styleMap = {
  positive: {
    border: "border-success/30",
    bg: "bg-success/5",
    iconColor: "text-success",
  },
  negative: {
    border: "border-warning/30",
    bg: "bg-warning/5",
    iconColor: "text-warning",
  },
  tip: {
    border: "border-info/30",
    bg: "bg-info/5",
    iconColor: "text-info",
  },
};

export function ScoreFactors() {
  const negatives = scoreFactors.filter((f) => f.type === "negative");
  const positives = scoreFactors.filter((f) => f.type === "positive");
  const tips = scoreFactors.filter((f) => f.type === "tip");

  return (
    <div className="space-y-6">
      {/* Negative factors */}
      {negatives.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-bold text-foreground">
            ⚠️ Pendências que afetam seu score
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {negatives.map((factor) => (
              <FactorCard key={factor.id} factor={factor} />
            ))}
          </div>
        </div>
      )}

      {/* Positive factors */}
      {positives.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-bold text-foreground">
            ✅ O que está indo bem
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {positives.map((factor) => (
              <FactorCard key={factor.id} factor={factor} />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-bold text-foreground">
            💡 Dicas para melhorar
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {tips.map((factor) => (
              <FactorCard key={factor.id} factor={factor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FactorCard({
  factor,
}: {
  factor: (typeof scoreFactors)[number];
}) {
  const Icon = iconMap[factor.type];
  const style = styleMap[factor.type];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-shadow hover:shadow-md",
        style.border,
        style.bg
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconColor)} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{factor.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {factor.description}
          </p>
          {factor.impact && (
            <span
              className={cn(
                "mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold",
                factor.type === "positive"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              )}
            >
              {factor.impact}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
