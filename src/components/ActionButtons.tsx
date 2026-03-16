import { Wallet, Receipt, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    label: "Atualizar Renda",
    description: "Envie seus comprovantes de renda atualizados",
    icon: Wallet,
    path: "/renda",
  },
  {
    label: "Adicionar Contas",
    description: "Cadastre contas recorrentes para aumentar seu score",
    icon: Receipt,
    path: "/contas",
  },
  {
    label: "Gamificação",
    description: "Complete desafios e ganhe pontos extras",
    icon: Gamepad2,
    path: "/gamificacao",
  },
];

export function ActionButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.path}
          to={action.path}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <action.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
