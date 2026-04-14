import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LEVELS } from "@/data/gamificationData";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/utils/supabase";
import { toast } from "sonner";

export const LevelProgress = () => {
  const { profile, loading } = useProfile();
  const { user } = useAuth();
  const prevLevelRef = useRef<number | null>(null);

  const totalPoints = profile?.points || 0;
  const currentLevelIndex = LEVELS.findIndex(level => totalPoints < level.minPoints) - 1;
  const currentLevelIndexSafe = Math.max(0, currentLevelIndex);
  const current = LEVELS[currentLevelIndexSafe];
  const next = LEVELS[currentLevelIndexSafe + 1] || current;

  useEffect(() => {
    if (!user || loading || !profile) return;

    const currentLevel = current.level;

    const checkAndNotify = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'level_up')
          .like('message', `%Nível ${currentLevel}%`)
          .limit(1);

        if (!data || data.length === 0) {
          if (currentLevel > 1) { // Skip notification for Level 1 (base level)
            const message = `🎉 Parabéns pela conquista! Você alcançou os pontos necessários e subiu para o Nível ${currentLevel} (${current.name})!`;
            
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'level_up',
              message: message,
              viewed: false,
              archived: false
            });
            
            toast.success(`🎉 Nível ${currentLevel} Alcançado!`, {
              description: `Você agora é um(a) ${current.name}!`
            });
          }
        }
      } catch (error) {
        console.error("Erro ao verificar/enviar notificação de level up", error);
      }
    };

    if (prevLevelRef.current === null || currentLevel > prevLevelRef.current) {
        checkAndNotify();
        prevLevelRef.current = currentLevel;
    }
  }, [current.level, current.name, user, profile, loading]);

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-6 shadow-lg border border-border">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-muted rounded-full"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressInLevel = totalPoints - current.minPoints;
  const pointsForNext = next.minPoints - current.minPoints;
  const percentage = pointsForNext > 0 ? Math.min((progressInLevel / pointsForNext) * 100, 100) : 100;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-6 shadow-lg border border-border">
      {/* Circular Progress */}
      <div className="relative">
        <svg width="130" height="130" className="-rotate-90">
          <circle cx="65" cy="65" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
          <circle
            cx="65" cy="65" r="52" fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-bold">
              {current.icon}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="text-center">
        <Badge className="mb-2 bg-gold text-customBlue text-lg px-4 py-2 hover:bg-gold/90">
          Nível {current.level} — {current.name}
        </Badge>
        <p className="text-3xl font-extrabold text-foreground">{totalPoints} <span className="text-base font-medium text-muted-foreground">pts</span></p>
        <p className="text-sm text-muted-foreground mt-1">
          {pointsForNext > 0 ? `${next.minPoints - totalPoints} pts para Nível ${next.level}` : "Nível máximo!"}
        </p>
      </div>
    </div>
  );
};
