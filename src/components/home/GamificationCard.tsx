import { Gamepad2, Star, Flame, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function GamificationCard() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [billsCount, setBillsCount] = useState(0);
  const [proofsCount, setProofsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchCounters = async () => {
      // Points
      const { data: profileData } = await supabase
        .from('profiles')
        .select('points')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profileData && profileData.points) {
        setPoints(profileData.points);
      }

      // Bills
      const { count: bCount } = await supabase
        .from('proofs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'bill');
      if (bCount !== null) setBillsCount(bCount);

      // Incomes/Proofs
      const { count: iCount } = await supabase
        .from('proofs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'income');
      if (iCount !== null) setProofsCount(iCount);

      // Courses
      const { count: cCount } = await supabase
        .from('courses_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);
      if (cCount !== null) setCoursesCount(cCount);
    };

    fetchCounters();
  }, [user]);

  const challenges = [
    { title: "Pagador Pontual", icon: Flame, points: 50, progress: Math.min((billsCount / 5) * 100, 100), total: `${billsCount}/5 contas` },
    { title: "Documentador", icon: Star, points: 30, progress: Math.min((proofsCount / 5) * 100, 100), total: `${proofsCount}/5 comprovantes` },
    { title: "Estudioso", icon: Trophy, points: 100, progress: Math.min((coursesCount / 3) * 100, 100), total: `${coursesCount}/3 cursos` },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Desafios Ativos
          </CardTitle>
          <Badge variant="secondary" className="font-semibold">{points} pts</Badge>
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
            <Progress value={c.progress || 0} className="h-2 bg-muted [&>div]:gradient-primary [&>div]:rounded-full" />
            <p className="text-xs text-primary font-semibold">+{c.points} pts ao completar</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
