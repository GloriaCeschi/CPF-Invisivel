import { Lightbulb, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
  { text: "Enviar comprovante de renda", done: true },
  { text: "Pagar conta de luz em dia", done: true },
  { text: "Completar curso de Educação Financeira", done: false },
  { text: "Cadastrar conta de internet", done: false },
  { text: "Enviar extrato PIX dos últimos 3 meses", done: false },
];

export function ScoreTipsCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-5 w-5 text-support" />
          Como melhorar seu score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-3">
            {tip.done ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <span className={`text-sm ${tip.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {tip.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
