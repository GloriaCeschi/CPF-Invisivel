import { GraduationCap, BookOpen, Briefcase, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    title: "Educação Financeira",
    desc: "Aprenda a organizar suas finanças e criar um orçamento inteligente.",
    icon: BookOpen,
    color: "text-info",
    bg: "bg-info/10",
    locked: false,
    progress: 40,
  },
  {
    title: "Empreendedorismo",
    desc: "Descubra como transformar suas habilidades em um negócio sustentável.",
    icon: Briefcase,
    color: "text-success",
    bg: "bg-success/10",
    locked: false,
    progress: 0,
  },
  {
    title: "Crédito Consciente",
    desc: "Entenda como usar crédito de forma responsável. Complete para liberar crédito gradual!",
    icon: ShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10",
    locked: true,
    requiredScore: 500,
    progress: 0,
  },
];

export function CoursesSection() {
  const currentScore = 420;
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h2 className="text-customBlue font-bold">Cursos e Educação</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course, i) => {
          const isLocked = course.locked && currentScore < (course.requiredScore || 0);
          return (
            <Card
              key={i}
              className={`card-hover relative overflow-hidden ${isLocked ? "opacity-75" : ""}`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    Score {course.requiredScore}+ necessário
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Faltam {(course.requiredScore || 0) - currentScore} pts
                  </Badge>
                </div>
              )}
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg ${course.bg} flex items-center justify-center mb-3`}>
                  <course.icon className={`h-5 w-5 ${course.color}`} />
                </div>
                <h3 className="font-bold text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{course.desc}</p>
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
                  className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
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
