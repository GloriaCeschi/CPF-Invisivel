import { useCallback, useEffect, useState, useRef } from "react";
import  supabase  from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MonthlySummary from "@/components/jornada/MonthlySummary";
import IncomeSection from "@/components/jornada/IncomeSection";
import BillSection from "@/components/jornada/BillSection";
import PendingSection from "@/components/jornada/PendingSection";
import BillModal from "@/components/jornada/BillModal";
import type { Tables } from "@/integrations/supabase/types";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


export default function Jornada() {
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
    <div className="min-h-screen bg-background">
      

      <main className="container mx-auto px-4 py-6 space-y-8 max-w-4xl">
        <MonthlySummary totalIncome={totalIncome} totalExpenses={totalExpenses} />
        <PendingSection bills={bills} onAddBill={() => setPendingModalOpen(true)} />
        <IncomeSection incomes={incomes} onRefresh={fetchData} />
        <BillSection bills={monthlyBills} onRefresh={fetchData} />
      </main>

      <BillModal open={pendingModalOpen} onClose={() => setPendingModalOpen(false)} onSaved={fetchData} />
    </div>
    </DashboardLayout>
  );
}
