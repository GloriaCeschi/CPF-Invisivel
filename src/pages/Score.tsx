import "../styles/score.css";

import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreEvolutionChart } from "@/components/ScoreEvolutionChart";
import { ScoreFactors } from "@/components/ScoreFactors";
import { ActionButtons } from "@/components/ActionButtons";
import { currentScore } from "@/data/mockData";

const Score = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Seu Score
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe sua pontuação e descubra como melhorar
        </p>
      </div>

      {/* Score gauge + actions */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="flex justify-center rounded-xl border border-border bg-card p-6">
          <ScoreGauge score={currentScore} />
        </div>
        <div className="space-y-6">
          <ActionButtons />
          <ScoreEvolutionChart />
        </div>
      </div>

      {/* Factors */}
      <ScoreFactors />
    </div>
  );
};

export default Score;
