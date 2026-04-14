import { Gamepad2, Star, Flame, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export function GamificationCard() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  
  const [billsCount, setBillsCount] = useState(0);
  const [proofsCount, setProofsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchCounters = async () => {
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
    { id: 'pagador_pontual', title: "Pagador Pontual", icon: Flame, reward: 50, isComplete: billsCount >= 5, progress: Math.min((billsCount / 5) * 100, 100), total: `${billsCount}/5 contas` },
    { id: 'documentador', title: "Documentador", icon: Star, reward: 30, isComplete: proofsCount >= 5, progress: Math.min((proofsCount / 5) * 100, 100), total: `${proofsCount}/5 comprovantes` },
    { id: 'estudioso', title: "Estudioso", icon: Trophy, reward: 100, isComplete: coursesCount >= 3, progress: Math.min((coursesCount / 3) * 100, 100), total: `${coursesCount}/3 cursos` },
  ];

  useEffect(() => {
    const checkAndAwardChallenges = async () => {
      if (!user || !profile || checking) return;
      
      setChecking(true);
      let awardedPoints = 0;

      for (const challenge of challenges) {
        if (challenge.isComplete) {
          const { data } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', user.id)
            .eq('type', 'challenge_completed')
            .eq('key_id', challenge.id)
            .limit(1);

          if (!data || data.length === 0) {
            awardedPoints += challenge.reward;
            
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'challenge_completed',
              key_id: challenge.id,
              message: `🏆 Desafio Concluído: ${challenge.title}! Você ganhou +${challenge.reward} pts.`,
              viewed: false,
              archived: false
            });
            
            toast.success(`Desafio ${challenge.title} concluído!`, {
              description: `Você ganhou +${challenge.reward} pontos extras na gamificação!`
            });
          }
        }
      }

      if (awardedPoints > 0) {
        await updateProfile({ points: (profile.points || 0) + awardedPoints });
      }
      
      setChecking(false);
    };

    if (challenges.some(c => c.isComplete)) {
      checkAndAwardChallenges();
    }
  }, [billsCount, proofsCount, coursesCount, profile?.id]); // Note: Using profile?.id to avoid deep comparison loops, assuming points load sets id

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Desafios Ativos
          </CardTitle>
          <Badge variant="secondary" className="font-semibold">{profile?.points || 0} pts</Badge>
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
            <p className={`text-xs font-semibold ${c.isComplete ? 'text-green-600' : 'text-primary'}`}>
              {c.isComplete ? '✔ Desafio Concluído!' : `+${c.reward} pts ao completar`}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
