import { Lock, Play, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface CourseData {
  id: number;
  title: string;
  description: string;
  progress: number;
  locked: boolean;
  lockReason?: string;
  category: string;
}

export function CourseCard({ course }: { course: CourseData }) {
  const isComplete = course.progress === 100;

  return (
    <div className=" animate-fade-in" style={{ animationDelay: `${course.id * 80}ms` }}>
      {course.locked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="group relative overflow-hidden border-border bg-card opacity-60 cursor-not-allowed pulse-glow">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <Lock className="h-10 w-10 text-muted-foreground" />
                  <div className="absolute inset-0 bg-foreground/5" />
                </div>
                <div className="p-4">
                  <span className="mb-1 inline-block rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-medium text-warning">
                    🔒 Bloqueado
                  </span>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{course.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px] text-xs">
            {course.lockReason}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Card className="group relative overflow-hidden border-border bg-card transition-shadow hover:shadow-lg cursor-pointer">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle className="h-10 w-10 text-success" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform group-hover:scale-110">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
              )}
            </div>
            <div className="p-4">
              <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isComplete ? "bg-success/20 text-success" : "bg-info/20 text-info"
              }`}>
                {isComplete ? "✅ Concluído" : `${course.progress}% completo`}
              </span>
              <h3 className="text-sm font-semibold text-foreground line-clamp-2">{course.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{course.description}</p>
              <Progress value={course.progress} className="mt-3 h-1.5" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
