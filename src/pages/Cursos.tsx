import { useEffect, useState } from "react";
import { BookOpen, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { CourseCard, CourseData } from "@/components/CourseCard";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";





const coursesData: CourseData[] = [
  { id: 1, title: "Como adicionar contas e boletos", description: "Aprenda a organizar e registrar suas contas e boletos de forma prática.", progress: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/dQw4w9WgXcQ?si=QzmfJ4v62nAcxv6j" },
  { id: 2, title: "Acompanhamento de renda", description: "Monitore suas fontes de renda e entenda seu fluxo financeiro mensal.", progress: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/3LNafnShdxE?si=yHpneS-xpMEFMso6" },
  { id: 3, title: "Gestão Financeira", description: "Curso completo de gestão financeira pessoal e familiar.", progress: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/PfsO9apQy-w?si=8aww5rwLFwxXnKB2" },
  { id: 4, title: "Empreendedorismo", description: "Inicie seu negócio com bases sólidas e planejamento estratégico.", progress: 0, locked: false, category: "Avançado", videoUrl: "https://youtu.be/kIFCyGkjEh4?si=NX8q3IUJj3nI9s1v" },
  { id: 5, title: "Planejamento Familiar", description: "Renegociação de dívidas, redução de despesas e orçamento familiar.", progress: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/Wyi4sPBPiCQ?si=PgbO183C-3_PsQtq" },
  { id: 6, title: "Uso Consciente de Crédito", description: "Entenda como usar crédito de forma inteligente e responsável.", progress: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/A4M9X1HIFoE?si=aPuEiyMUAxU1rbHm" },
  { id: 7, title: "Valor da Sua Hora", description: "Calcule quanto vale a sua hora de trabalho e negocie melhor.", progress: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/zbHNXLaDXco?si=GwO1AGsYjyXQVi6e" },
  { id: 8, title: "Valor da Sua Mão de Obra", description: "Aprenda a precificar seus serviços e trabalho corretamente.", progress: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/cxHmqMCn6bA?si=GxTOoxv6ONoWi_oi" },
  { id: 9, title: "Cálculos de Juros e Investimentos", description: "Capacitação básica para entender juros compostos e investimentos.", progress: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/dGU6yREVWyM?si=7HdTSSOfcvd29QiA" },
  { id: 10, title: "Direitos do Consumidor", description: "Conheça seus direitos e saiba como se proteger nas relações de consumo.", progress: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/pZBDVklQT-g?si=fY6M2J1nm2XwQmvu" },
  { id: 11, title: "Como Entender o Mercado", description: "Bolsa de valores, produtos financeiros e como o mercado funciona.", progress: 0, locked: false, category: "Avançado", videoUrl: "https://youtu.be/zE3MhwFUpnA?si=ZNnysyqhTlMBfij0" },
  {
    id: 12,
    title: "Investimentos para Iniciantes",
    description: "Aprenda a investir do zero. Ao concluir, você receberá crédito gradual!",
    progress: 0,
    locked: true,
    lockReason: "Requisitos: Score mínimo de 500 pontos + concluir 'Como Entender o Mercado' e 'Uso Consciente de Crédito' + 75% do curso de Educação Financeira.",
    category: "Avançado",
  },
];

export default function Cursos() {
  const { user } = useAuth();
  const [overallProgress, setOverallProgress] = useState(0);
  const totalProgress = Math.round(
    coursesData.filter((c) => !c.locked).reduce((sum, c) => sum + c.progress, 0) /
    coursesData.filter((c) => !c.locked).length
  );

  useEffect(() => {
    const timer = setTimeout(() => setOverallProgress(totalProgress), 300);
    return () => clearTimeout(timer);
  }, [totalProgress]);

  const handleCourseCompletion = async (course: CourseData) => {
    if (!user) return;
    if (course.progress < 100) return; // só pontua se concluído

    try {
      const { error } = await supabase.rpc("add_course_points", {
        uid: user.id,
        pts: 25, // cada curso concluído dá 25 pontos
      });

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Parabéns!",
          description: `Você ganhou 25 pontos por concluir "${course.title}" 🎉`,
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
                  <h1 className="text-2xl font-bold text-foreground md:text-3xl">Educação Financeira</h1>
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
                    {coursesData.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
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
