import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreEvolutionChart } from "@/components/ScoreEvolutionChart";
import { ScoreFactors } from "@/components/ScoreFactors";
import { ActionButtons } from "@/components/ActionButtons";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useCallback, useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import MonthlySummary from "@/components/jornada/MonthlySummary";
import IncomeSection from "@/components/jornada/IncomeSection";
import BillSection from "@/components/jornada/BillSection";
import PendingSection from "@/components/jornada/PendingSection";
import BillModal from "@/components/jornada/BillModal";
import type { Proof } from "@/types/jornada";

const Score = () => {
  const { user } = useAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [score, setScore] = useState(0);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    // Busca pontos do perfil para calcular o score
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("points")
      .eq("user_id", user.id)
      .single();

    if (!profileError && profileData) {
      // Cada 10 pontos da gamificação geram 2 pontos no score
      const score = Math.floor((profileData.points || 0) / 5);
      setCalculatedScore(score);
    }

    // Busca todos os comprovantes do usuário no mês
    const { data, error } = await supabase
      .from("proofs")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar proofs:", error);
    } else {
      setProofs(data || []);
    }

    // Busca os pontos do usuário em profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("points")
      .eq("user_id", user.id);

    if (profilesError) {
      console.error("Erro ao buscar points em profiles:", profilesError);
    } else {
      const totalScore =
        profilesData?.reduce((sum, profile) => sum + Number(profile.points || 0), 0) || 0;

      setScore(totalScore);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Separa incomes e bills
  const incomes = proofs.filter((p) => p.type === "income");
  const bills = proofs.filter((p) => p.type === "bill");

  const monthlyBills = bills.filter((b) => {
    const d = new Date(b.created_at);
    return d >= startOfMonth && d <= endOfMonth;
  });

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = monthlyBills.reduce((sum, b) => sum + Number(b.amount), 0);

  const monthName = now.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
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
          <div className="flex justify-center items-center rounded-xl border border-border bg-card p-6">
            <ScoreGauge score={calculatedScore} />
          </div>
          <div className="space-y-6">
            <ActionButtons />
            <ScoreEvolutionChart />
          </div>
        </div>

        <MonthlySummary totalIncome={totalIncome} totalExpenses={totalExpenses} />

        {/* Factors */}
        <ScoreFactors />
      </div>

      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-6 space-y-8 max-w-4xl">
          {/* Pendentes */}
          <PendingSection bills={bills} onAddBill={() => setPendingModalOpen(true)} />

          {/* Renda */}
          <div id="renda">
            <IncomeSection incomes={incomes} onRefresh={fetchData} />
          </div>

          {/* Contas */}
          <div id="contas">
            <BillSection bills={monthlyBills} onRefresh={fetchData} />
          </div>
        </main>

        <BillModal
          open={pendingModalOpen}
          onClose={() => setPendingModalOpen(false)}
          onSaved={fetchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default Score;