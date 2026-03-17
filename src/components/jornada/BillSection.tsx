import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import  supabase  from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import BillModal from "./BillModal";
import type { Tables } from "@/integrations/supabase/types.ts";

interface BillSectionProps {
  bills: Tables<"bills">[];
  onRefresh: () => void;
}

function getBillStatus(bill: Tables<"bills">): "pago" | "proximo" | "atrasado" {
  if (!bill.next_due_date) return "pago";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(bill.next_due_date + "T00:00:00");
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "atrasado";
  if (diffDays <= 5) return "proximo";
  return "pago";
}

const STATUS_CONFIG = {
  pago: { icon: CheckCircle, label: "Pago", className: "text-success bg-success/10" },
  proximo: { icon: AlertTriangle, label: "Vence em breve", className: "text-warning bg-warning/10" },
  atrasado: { icon: XCircle, label: "Atrasado", className: "text-destructive bg-destructive/10" },
};

export default function BillSection({ bills, onRefresh }: BillSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"bills"> | null>(null);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bills").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Conta excluída" });
      onRefresh();
    }
  };

  const formatCurrency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display text-customBlue">Contas Pagas</h2>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Conta
        </Button>
      </div>

      {bills.length === 0 ? (
        <Card className="border-dashed border-2 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <p className="font-medium">Nenhuma conta registrada este mês</p>
            <p className="text-sm">Clique em "Adicionar Conta" para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => {
            const status = getBillStatus(bill);
            const cfg = STATUS_CONFIG[status];
            const StatusIcon = cfg.icon;

            return (
              <Card key={bill.id} className="bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{bill.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                      {bill.total_installments > 1 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                          {bill.current_installment}/{bill.total_installments}
                        </span>
                      )}
                    </div>
                    {bill.description && <p className="text-sm text-muted-foreground truncate">{bill.description}</p>}
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Pago em: {formatDate(bill.payment_date)}</span>
                      {bill.next_due_date && <span>Próx. vencimento: {formatDate(bill.next_due_date)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-lg font-bold text-destructive whitespace-nowrap">{formatCurrency(bill.amount)}</span>
                    <div className="flex gap-1">
                      {bill.receipt_url && (
                        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                          <a href={bill.receipt_url} target="_blank" rel="noopener noreferrer"><FileText className="h-4 w-4" /></a>
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(bill); setModalOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(bill.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BillModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={onRefresh} editingBill={editing} />
    </section>
  );
}
