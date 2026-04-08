import { LevelProgress } from "@/components/gamification/LevelProgress";
import { PointsFilter } from "@/components/gamification/PointsFilter";
import { ScoreContribution } from "@/components/gamification/ScoreContribution";
import { CourseList } from "@/components/gamification/CourseList";
import { LevelMap } from "@/components/gamification/LevelMap";
import { ActivityHistory } from "@/components/gamification/ActivityHistory";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

const Gamificacao = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        console.log("Perfil não encontrado");
        navigate("/profile");
        return;
      }

      // Verifica se o perfil tem os dados essenciais
      const isProfileComplete = data.name;

      if (!isProfileComplete) {
        console.log("Perfil incompleto");
        navigate("/profile");
      } else {
        setLoadingProfile(false);
      }
    };

    checkProfile();
  }, [user, navigate]);

  if (loadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verificando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 p-5">
          <main className="w-full px-4 py-6 space-y-5 pb-20">
            <LevelProgress />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PointsFilter />
              <ScoreContribution />
            </div>
            <LevelMap />
            <CourseList />
            <ActivityHistory />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Gamificacao;
