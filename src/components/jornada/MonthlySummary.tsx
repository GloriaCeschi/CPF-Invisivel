import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface MonthlySummaryProps {
  totalIncome: number;
  totalExpenses: number;
}

export default function MonthlySummary({ totalIncome, totalExpenses }: MonthlySummaryProps) {
  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-none shadow-md bg-card">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Renda do Mês</p>
            <p className="text-xl font-bold text-success">{formatCurrency(totalIncome)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-card">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Gastos do Mês</p>
            <p className="text-xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-card">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Saldo</p>
            <p className={`text-xl font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
