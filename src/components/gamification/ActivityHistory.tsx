import { ACTIVITIES } from "@/data/gamificationData";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, HelpCircle, Target } from "lucide-react";

const typeConfig = {
  aula: { 
    icon: BookOpen, 
    label: "Aula", 
    color: "bg-info text-info-foreground" 
  },
  comprovante: { 
    icon: FileText, 
    label: "Comprovante", 
    color: "bg-warning text-warning-foreground" 
  },
  quiz: { 
    icon: HelpCircle, 
    label: "Quiz", 
    color: "bg-primary text-primary-foreground" 
  },
  meta: { 
    icon: Target, 
    label: "Meta", 
    color: "bg-success text-success-foreground" 
  },
};

export const ActivityHistory = () => {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Atividades Recentes
      </h3>

      <div className="space-y-3">
        {ACTIVITIES.map((act) => {
          const config = typeConfig[act.type];
          const Icon = config.icon;

          return (
            <div
              key={act.id}
              className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors"
            >
              <div className={`rounded-full p-2 shrink-0 ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {act.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(act.date).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 shrink-0">
                +{act.points} pts
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};