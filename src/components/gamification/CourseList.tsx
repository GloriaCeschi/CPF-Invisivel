import { useState, useEffect } from "react";
import { COURSES } from "@/data/coursesData";
import { LEVELS } from "@/data/gamificationData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, BookOpen } from "lucide-react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

interface CourseProgress {
  course_id: number;
  progress: number;
  completed_at: string | null;
}

export const CourseList = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadCourseProgress();
    }
  }, [user]);

  const loadCourseProgress = async () => {
    const { data, error } = await supabase
      .from('courses_progress')
      .select('course_id, progress, completed_at')
      .eq('user_id', user!.id);

    if (error) {
      console.error('Error loading course progress:', error);
    } else {
      setCourseProgress(data || []);
    }
    setLoading(false);
  };

  if (loading || !profile) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentLevel = LEVELS.findIndex(level => (profile.points || 0) < level.minPoints) || LEVELS.length - 1;

  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Cursos & Aulas</h3>
      </div>
      <div className="space-y-3">
        {COURSES.map((course) => {
          const courseId = typeof course.id === 'number' ? course.id : Number(course.id);
          const progressData = courseProgress.find(cp => cp.course_id === courseId);
          const isCompleted = progressData?.progress === 100;
          const locked = course.requiredLevel > currentLevel + 1;
          const reqLevel = LEVELS[course.requiredLevel - 1];
          const lessonProgress = progressData ? progressData.progress : 0;

          return (
            <div
              key={course.id}
              className={`rounded-xl border p-4 transition-all ${
                locked
                  ? "opacity-50 border-border bg-muted/30"
                  : isCompleted
                  ? "border-success/40 bg-success/5"
                  : "border-primary/20 bg-card hover:shadow-md hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    )}
                    <h4 className="font-semibold text-sm text-foreground truncate">{course.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{course.description}</p>
                  {!locked && (
                    <div className="flex items-center gap-2">
                      <Progress value={lessonProgress} className="h-2 flex-1 bg-secondary [&>div]:bg-primary" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {lessonProgress === 100 ? 'Completo' : `${Math.floor(lessonProgress)}%`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-success text-success-foreground" : ""}>
                    +{course.points} pts
                  </Badge>
                  {locked && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Nível {reqLevel.level} {reqLevel.icon}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
