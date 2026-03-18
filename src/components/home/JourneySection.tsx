import { Route, UserPlus, Receipt, BarChart3, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const journeyItems = [
  {
    title: "Cadastro Voluntário",
    desc: "Envie comprovantes de renda, recibos e extratos para formar seu perfil financeiro.",
    icon: UserPlus,
    color: "text-primary",
    bg: "bg-primary/10",
    action: "Enviar documentos",
  },
  {
    title: "Contas e Boletos",
    desc: "Adicione suas contas recorrentes (aluguel, luz, internet) e ganhe pontos por pagamentos em dia.",
    icon: Receipt,
    color: "text-success",
    bg: "bg-success/10",
    action: "Adicionar contas",
  },
  {
    title: "Acompanhamento de Renda",
    desc: "Acompanhe sua renda mensal, veja tendências e receba insights personalizados.",
    icon: BarChart3,
    color: "text-info",
    bg: "bg-info/10",
    action: "Ver relatório",
  },
];

export function JourneySection() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Route className="h-5 w-5 text-primary" />
        <h2 className="text-customBlue font-bold">Construa sua Jornada Financeira</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {journeyItems.map((item, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{item.desc}</p>
              <button className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                {item.action}
                <ChevronRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
