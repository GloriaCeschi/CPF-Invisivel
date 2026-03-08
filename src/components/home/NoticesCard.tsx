import { Bell, TrendingUp, TrendingDown, Minus, FileCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notices = [
  {
    icon: TrendingUp,
    color: "text-success",
    bg: "bg-success/10",
    title: "Score aumentou!",
    desc: "Seu score subiu 15 pontos após pagamento confirmado.",
    time: "Há 2 horas",
  },
  {
    icon: FileCheck,
    color: "text-info",
    bg: "bg-info/10",
    title: "Comprovante aprovado",
    desc: "Seu comprovante de renda foi validado pela IA.",
    time: "Há 1 dia",
  },
  {
    icon: AlertCircle,
    color: "text-support",
    bg: "bg-support/10",
    title: "Documento em análise",
    desc: "Seu extrato PIX está sendo analisado.",
    time: "Há 2 dias",
  },
  {
    icon: Minus,
    color: "text-muted-foreground",
    bg: "bg-muted",
    title: "Score mantido",
    desc: "Seu score se manteve estável este mês.",
    time: "Há 5 dias",
  },
];

export function NoticesCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-5 w-5 text-support" />
          Avisos e Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notices.map((n, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className={`w-9 h-9 rounded-lg ${n.bg} flex items-center justify-center flex-shrink-0`}>
              <n.icon className={`h-4 w-4 ${n.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
