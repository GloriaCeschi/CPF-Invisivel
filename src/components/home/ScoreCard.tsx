import { useState, useEffect } from "react";
import { TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";

export function ScoreCard() {
  const [score, setScore] = useState(0);
  const maxScore = 1000;
  const navigate = useNavigate();

  useEffect(() => {
    let channel: any;

    const setupScore = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Usuário:", user);

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("points")
        .eq("user_id", user.id)
        .single();

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (data) {
        // Cada 10 pontos da gamificação geram 2 pontos no score
        const calculatedScore = Math.floor((data.points || 0) / 5);
        setScore(calculatedScore);
      }

      channel = supabase
        .channel("profile-points-listener")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `user_id=eq.${user.id}`, // ✅ campo correto
          },
          (payload) => {
            console.log("Realtime UPDATE recebido:", payload);
            // Cada 10 pontos da gamificação geram 2 pontos no score
            const calculatedScore = Math.floor((payload.new.points || 0) / 5);
            setScore(calculatedScore);
          }
        )
        .subscribe((status) => {
          console.log("Status do canal Realtime:", status);
        });
    };

    setupScore();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const percent = (score / maxScore) * 100;

  const getScoreLabel = (s: number) => {
    if (s < 300) return { label: "Baixo", color: "text-destructive" };
    if (s < 500) return { label: "Regular", color: "text-support" };
    if (s < 700) return { label: "Bom", color: "text-info" };
    return { label: "Excelente", color: "text-success" };
  };

  const { label, color } = getScoreLabel(score);

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              Seu Score Alternativo
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-foreground">
                {score}
              </span>
              <span className="text-sm text-muted-foreground">
                / {maxScore}
              </span>
            </div>
            <span className={`text-sm font-semibold ${color}`}>
              {label}
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center score-ring">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(percent)}%</span>
          </div>

          <Progress
            value={percent}
            className="h-3 bg-muted [&>div]:gradient-primary [&>div]:rounded-full"
          />
        </div>

        <button
          onClick={() => navigate("/score")}
          className="flex pt-2 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Ver detalhes do score
          <ChevronRight className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}