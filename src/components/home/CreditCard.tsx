import { CreditCard as CreditCardIcon, ChevronRight, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const offers = [
  { bank: "FinBank Digital", limit: "R$ 500,00", status: "Pré-aprovado", available: true },
  { bank: "CrediJá", limit: "R$ 300,00", status: "Em análise", available: false },
  { bank: "NovaCred", limit: "R$ 1.000,00", status: "Score 600+", available: false },
];

export function CreditAreaCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCardIcon className="h-5 w-5 text-info" />
          Área de Crédito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {offers.map((offer, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              offer.available ? "bg-card border-success/30" : "bg-muted/50 border-border"
            }`}
          >
            <div>
              <p className="text-sm font-semibold">{offer.bank}</p>
              <p className="text-xs text-muted-foreground">Limite: {offer.limit}</p>
            </div>
            <div className="flex items-center gap-2">
              {offer.available ? (
                <Badge className="bg-success text-success-foreground text-xs">{offer.status}</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {offer.status}
                </Badge>
              )}
              {offer.available && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
