import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LEVELS, USER_MOCK } from "@/data/gamificationData";

export const LevelProgress = () => {
  const current = LEVELS[USER_MOCK.currentLevel - 1];
  const next = LEVELS[USER_MOCK.currentLevel] || current;
  const progressInLevel = USER_MOCK.totalPoints - current.minPoints;
  const pointsForNext = next.minPoints - current.minPoints;
  const percentage = pointsForNext > 0 ? Math.min((progressInLevel / pointsForNext) * 100, 100) : 100;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-6 shadow-lg border border-border">
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
            <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
              {current.icon}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="text-center">
        <Badge className="mb-2 bg-gold text-gold-foreground text-sm px-3 py-1 hover:bg-gold/90">
          Nível {current.level} — {current.name}
        </Badge>
        <p className="text-3xl font-extrabold text-foreground">{USER_MOCK.totalPoints} <span className="text-base font-medium text-muted-foreground">pts</span></p>
        <p className="text-sm text-muted-foreground mt-1">
          {pointsForNext > 0 ? `${next.minPoints - USER_MOCK.totalPoints} pts para Nível ${next.level}` : "Nível máximo!"}
        </p>
      </div>
    </div>
  );
};
