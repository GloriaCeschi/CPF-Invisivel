import { useEffect, useState } from "react";
import { BookOpen, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { CourseCard, CourseData } from "@/components/CourseCard";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { COURSES as initialCoursesData } from "@/data/coursesData";


export default function Cursos() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseData[]>(initialCoursesData);
  const [overallProgress, setOverallProgress] = useState(0);

  const totalProgress = Math.round(
    courses.filter((c) => !c.locked).reduce((sum, c) => sum + c.progress, 0) /
    courses.filter((c) => !c.locked).length
  );

  useEffect(() => {
    const timer = setTimeout(() => setOverallProgress(totalProgress), 300);
    return () => clearTimeout(timer);
  }, [totalProgress]);

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

  const handleCourseCompletion = async (course: CourseData) => {
    if (!user) return;
    if (course.progress < 100) return; // só pontua se concluído

    try {
      const { error } = await supabase.rpc("complete_course", {
        uid: user.id,
        course_id: course.id,
        pts: 45,
      });

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        setCourses((prevCourses) =>
          prevCourses.map((c) => (c.id === course.id ? { ...c, progress: 100 } : c))
        );

        toast({
          title: "Parabéns!",
          description: `Você ganhou 45 pontos por concluir "${course.title}" 🎉`,
        });
      }
    } catch (err) {
      toast({ title: "Erro", description: String(err), variant: "destructive" });
    }
  };

  return (

    <DashboardLayout>
      <div className="min-h-screen flex w-full">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto">
            {/* Hero Section */}
            <section className="relative px-6 py-10 md:px-12 lg:px-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
              <div className="mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground md:text-3xl">Gestão Financeira</h1>
                </div>
                <p className="mb-6 text-sm text-muted-foreground max-w-2xl">
                  Cada curso concluído é um passo a mais rumo à sua independência financeira. Você está no caminho certo! 💪
                </p>

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-foreground">Seu progresso geral</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {overallProgress < 30 ? "Continue assim! Cada passo conta." :
                      overallProgress < 70 ? "Ótimo progresso! Você está evoluindo rápido." :
                        "Incrível! Você está quase dominando tudo!"}
                  </p>
                </div>
              </div>
            </section>



            {/* Courses Grid */}
            <TooltipProvider>
              <section className="px-6 py-10 md:px-12 lg:px-20">
                <div className="mx-auto px-6 md:px-12 lg:px-20 courses-container">
                  <h2 className="mb-6 text-lg font-bold text-foreground">Cursos Disponíveis</h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
                    {courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onProgressSave={(updatedCourse) => {
                          setCourses((prevCourses) =>
                            prevCourses.map((c) =>
                              c.id === updatedCourse.id ? { ...c, progress: 100 } : c
                            )
                          );
                        }}
                        onComplete={() => handleCourseCompletion(course)}
                      />

                    ))}
                  </div>
                </div>
              </section>
            </TooltipProvider>
          </main>


        </div>
      </div>
    </DashboardLayout>

  );
}
