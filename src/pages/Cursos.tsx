import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { AccessibilityButton } from "@/components/AccessibilityButton";
import { CourseCard, CourseData } from "@/components/CourseCard";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

const coursesData: CourseData[] = [
  { id: 1, title: "Como adicionar contas e boletos", description: "Aprenda a organizar e registrar suas contas e boletos de forma prática.", progress: 100, locked: false, category: "Básico" },
  { id: 2, title: "Acompanhamento de renda", description: "Monitore suas fontes de renda e entenda seu fluxo financeiro mensal.", progress: 72, locked: false, category: "Básico" },
  { id: 3, title: "Gestão Financeira", description: "Curso completo de gestão financeira pessoal e familiar.", progress: 45, locked: false, category: "Intermediário" },
  { id: 4, title: "Empreendedorismo", description: "Inicie seu negócio com bases sólidas e planejamento estratégico.", progress: 20, locked: false, category: "Avançado" },
  { id: 5, title: "Planejamento Familiar", description: "Renegociação de dívidas, redução de despesas e orçamento familiar.", progress: 0, locked: false, category: "Intermediário" },
  { id: 6, title: "Uso Consciente de Crédito", description: "Entenda como usar crédito de forma inteligente e responsável.", progress: 30, locked: false, category: "Básico" },
  { id: 7, title: "Valor da Sua Hora", description: "Calcule quanto vale a sua hora de trabalho e negocie melhor.", progress: 0, locked: false, category: "Básico" },
  { id: 8, title: "Valor da Sua Mão de Obra", description: "Aprenda a precificar seus serviços e trabalho corretamente.", progress: 0, locked: false, category: "Intermediário" },
  { id: 9, title: "Cálculos de Juros e Investimentos", description: "Capacitação básica para entender juros compostos e investimentos.", progress: 10, locked: false, category: "Intermediário" },
  { id: 10, title: "Direitos do Consumidor", description: "Conheça seus direitos e saiba como se proteger nas relações de consumo.", progress: 60, locked: false, category: "Básico" },
  { id: 11, title: "Como Entender o Mercado", description: "Bolsa de valores, produtos financeiros e como o mercado funciona.", progress: 15, locked: false, category: "Avançado" },
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
  const [overallProgress, setOverallProgress] = useState(0);
  const totalProgress = Math.round(
    coursesData.filter((c) => !c.locked).reduce((sum, c) => sum + c.progress, 0) /
      coursesData.filter((c) => !c.locked).length
  );

  useEffect(() => {
    const timer = setTimeout(() => setOverallProgress(totalProgress), 300);
    return () => clearTimeout(timer);
  }, [totalProgress]);

  return (
    
    <DashboardLayout>
      <div className="min-h-screen flex w-full">
        <div className="flex-1 flex flex-col">
           
          {/* <AppHeader /> */}
          {/* <AccessibilityButton /> */}
          
          
          

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
                      <CourseCard key={course.id} course={course} />
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
