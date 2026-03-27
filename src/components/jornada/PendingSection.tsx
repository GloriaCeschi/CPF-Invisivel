import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Star } from "lucide-react";
import type { Bill } from "@/types/jornada";

interface PendingSectionProps {
  bills: Bill[];
  onAddBill: () => void;
}

export default function PendingSection({ bills, onAddBill }: PendingSectionProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = bills.filter((b) => {
    if (!b.next_due_date) return false;
    const due = new Date(b.next_due_date + "T00:00:00");
    return due < today;
  });

  const upcoming = bills.filter((b) => {
    if (!b.next_due_date) return false;
    const due = new Date(b.next_due_date + "T00:00:00");
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 5;
  });

  if (overdue.length === 0 && upcoming.length === 0) return null;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  return (
    <section>
      <h2 className="text-xl font-bold font-display mb-4">⚠️ Pendências e Alertas</h2>
      <div className="space-y-3">
        {overdue.map((bill) => (
          <Card key={bill.id} className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">{bill.title} — Atrasado!</p>
                  <p className="text-sm text-muted-foreground">
                    Venceu em {formatDate(bill.next_due_date!)}
                    {bill.total_installments > 1 && ` (parcela ${bill.current_installment}/${bill.total_installments})`}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={onAddBill}>
                Registrar pagamento
              </Button>
            </CardContent>
          </Card>
        ))}

        {upcoming.map((bill) => (
          <Card key={bill.id} className="border-warning/30 bg-warning/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-semibold">
                    {bill.title} vence em {formatDate(bill.next_due_date!)}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    Adicione a conta de {bill.title} deste mês e ganhe pontos! 🎯
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={onAddBill}>
                Pagar agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
