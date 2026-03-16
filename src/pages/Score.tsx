
import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreEvolutionChart } from "@/components/ScoreEvolutionChart";
import { ScoreFactors } from "@/components/ScoreFactors";
import { ActionButtons } from "@/components/ActionButtons";
import { currentScore } from "@/data/mockData";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useCallback, useEffect, useState, useRef } from "react";
import  supabase  from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MonthlySummary from "@/components/jornada/MonthlySummary";
import IncomeSection from "@/components/jornada/IncomeSection";
import BillSection from "@/components/jornada/BillSection";
import PendingSection from "@/components/jornada/PendingSection";
import BillModal from "@/components/jornada/BillModal";
import type { Tables } from "@/integrations/supabase/types";





const Score = () => {

 const { user, signOut } = useAuth();
  const [incomes, setIncomes] = useState<Tables<"incomes">[]>([]);
  const [bills, setBills] = useState<Tables<"bills">[]>([]);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const [incomesRes, billsRes] = await Promise.all([
      supabase.from("incomes").select("*").gte("recorded_at", startOfMonth).lte("recorded_at", endOfMonth).order("recorded_at", { ascending: false }),
      supabase.from("bills").select("*").order("payment_date", { ascending: false }),
    ]);

    if (incomesRes.data) setIncomes(incomesRes.data);
    if (billsRes.data) setBills(billsRes.data);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const monthlyBills = bills.filter((b) => {
    const d = new Date(b.payment_date);
    return d >= startOfMonth && d <= endOfMonth;
  });

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = monthlyBills.reduce((sum, b) => sum + Number(b.amount), 0);

  const monthName = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

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
        <div className="flex justify-center rounded-xl border border-border bg-card p-6">
        
          <ScoreGauge score={currentScore} />
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
    <div className="min-h-screen bg-background">
          
    
          <main className="container mx-auto px-4 py-6 space-y-8 max-w-4xl">
            
            <PendingSection bills={bills} onAddBill={() => setPendingModalOpen(true)} />
            <div id ='renda'>
              <IncomeSection  incomes={incomes} onRefresh={fetchData} /> 
            </div>
            <div id = 'contas'>
              <BillSection bills={monthlyBills} onRefresh={fetchData} />
            </div>
          </main>
    
          <BillModal open={pendingModalOpen} onClose={() => setPendingModalOpen(false)} onSaved={fetchData} />
        </div>
    </DashboardLayout>
  );
};

export default Score;
