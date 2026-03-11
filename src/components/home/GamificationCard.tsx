import { Gamepad2, Star, Flame, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const challenges = [
  { title: "Pagador Pontual", icon: Flame, points: 50, progress: 80, total: "4/5 contas" },
  { title: "Documentador", icon: Star, points: 30, progress: 60, total: "3/5 comprovantes" },
  { title: "Estudioso", icon: Trophy, points: 100, progress: 33, total: "1/3 cursos" },
];

export function GamificationCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Desafios Ativos
          </CardTitle>
          <Badge variant="secondary" className="font-semibold">180 pts</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((c, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <c.icon className="h-4 w-4 text-support" />
                <span className="text-sm font-medium">{c.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{c.total}</span>
            </div>
            <Progress value={c.progress} className="h-2 bg-muted [&>div]:gradient-primary [&>div]:rounded-full" />
            <p className="text-xs text-primary font-semibold">+{c.points} pts ao completar</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
