import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import  supabase  from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import IncomeModal from "./IncomeModal";
import type { Income } from "@/types/jornada";

const RECEIPT_LABELS: Record<string, string> = {
  pix: "PIX",
  cartao_credito: "Cartão Crédito",
  cartao_debito: "Cartão Débito",
  deposito: "Depósito",
};

interface IncomeSectionProps {
  incomes: Income[];
  onRefresh: () => void;
}

export default function IncomeSection({ incomes, onRefresh }: IncomeSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"incomes"> | null>(null);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("incomes").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Renda excluída" });
      onRefresh();
    }
  };

  const formatCurrency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display text-[hsl(218,26%,29%)] "> Minhas Rendas</h2>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Renda
        </Button>
      </div>

      {incomes.length === 0 ? (
        <Card className="border-dashed border-2 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <p className="font-medium">Nenhuma renda registrada este mês</p>
            <p className="text-sm">Clique em "Adicionar Renda" para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <Card key={income.id} className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{income.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {RECEIPT_LABELS[income.receipt_type] || income.receipt_type}
                    </span>
                  </div>
                  {income.description && <p className="text-sm text-muted-foreground truncate">{income.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(income.recorded_at)}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-lg font-bold text-success whitespace-nowrap">{formatCurrency(income.amount)}</span>
                  <div className="flex gap-1">
                    {income.receipt_url && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                        <a href={income.receipt_url} target="_blank" rel="noopener noreferrer"><FileText className="h-4 w-4" /></a>
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(income); setModalOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(income.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <IncomeModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={onRefresh} editingIncome={editing} />
    </section>
  );
}
