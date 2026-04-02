import { GraduationCap, Lock, ChevronRight, BookOpen, Briefcase, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { COURSES as initialCoursesData, CourseInfo } from "@/data/coursesData";

// Helper for generic icons and colors on Home section
const getCategoryStyle = (category: string) => {
  if (category === "Básico") {
    return { icon: BookOpen, color: "text-info", bg: "bg-info/10" };
  }
  if (category === "Intermediário") {
    return { icon: Briefcase, color: "text-primary", bg: "bg-primary/10" };
  }
  return { icon: ShieldCheck, color: "text-success", bg: "bg-success/10" };
};

export function CoursesSection() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseInfo[]>(initialCoursesData.slice(0, 3));
  
  const currentScore = profile?.points || 0;

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from("courses_progress")
        .select("course_id, progress")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao carregar progresso de cursos", error);
        return;
      }

      if (data?.length) {
        setCourses((prevCourses) =>
          prevCourses.map((course) => {
            const row = data.find((item: any) => item.course_id === course.id);
            return row ? { ...course, progress: row.progress } : course;
          })
        );
      }
    };

    fetchProgress();
  }, [user]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h2 className="text-customBlue font-bold">Cursos e Educação</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => {
          // Simplification for the Home section: checking if course is naturally locked
          // or locked due to a score requirement not being met (just as an example, using requiredLevel as an indicator)
          const isLocked = course.locked;
          const { icon: Icon, color, bg } = getCategoryStyle(course.category);
          
          return (
            <Card
              key={course.id}
              className={`card-hover relative overflow-hidden ${isLocked ? "opacity-75" : ""}`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-semibold text-muted-foreground text-center px-2">
                    {course.lockReason || "Curso Bloqueado"}
                  </p>
                </div>
              )}
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-bold text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                {course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progresso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => navigate("/cursos")}
                  className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline mt-auto pt-2"
                >
                  {course.progress > 0 ? "Continuar" : "Começar"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
