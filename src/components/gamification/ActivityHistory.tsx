import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, HelpCircle, Target } from "lucide-react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { COURSES } from "@/data/gamificationData";

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

interface Activity {
  id: string;
  description: string;
  points: number;
  date: string;
  type: "aula" | "comprovante" | "quiz" | "meta";
}

export const ActivityHistory = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    const activitiesList: Activity[] = [];

    // Load course completions
    const { data: courseData, error: courseError } = await supabase
      .from('courses_progress')
      .select('course_id, completed_at')
      .eq('user_id', user!.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (!courseError && courseData) {
      courseData.forEach(cp => {
        const course = COURSES.find(c => c.id === cp.course_id.toString());
        if (course) {
          activitiesList.push({
            id: `course-${cp.course_id}`,
            description: `Completou o curso: ${course.title}`,
            points: course.points,
            date: cp.completed_at!,
            type: 'aula'
          });
        }
      });
    }

    // Load proof approvals
    const { data: proofData, error: proofError } = await supabase
      .from('proofs')
      .select('id, title, type, points, created_at')
      .eq('user_id', user!.id)
      .eq('status', 'aprovado')
      .order('created_at', { ascending: false });

    if (!proofError && proofData) {
      proofData.forEach(proof => {
        activitiesList.push({
          id: `proof-${proof.id}`,
          description: `Comprovante aprovado: ${proof.title}`,
          points: proof.points || 0,
          date: proof.created_at,
          type: proof.type === 'income' ? 'comprovante' : 'meta'
        });
      });
    }

    // Sort by date descending
    activitiesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setActivities(activitiesList.slice(0, 10)); // Show last 10
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
        Atividades Recentes
      </h3>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma atividade recente
          </p>
        ) : (
          activities.map((act) => {
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
          })
        )}
      </div>
    </div>
  );
};