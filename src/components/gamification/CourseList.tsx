import { COURSES, LEVELS, USER_MOCK } from "@/data/gamificationData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, BookOpen } from "lucide-react";

export const CourseList = () => {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Cursos & Aulas</h3>
      </div>
      <div className="space-y-3">
        {COURSES.map((course) => {
          const locked = course.requiredLevel > USER_MOCK.currentLevel;
          const reqLevel = LEVELS[course.requiredLevel - 1];
          const lessonProgress = course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;

          return (
            <div
              key={course.id}
              className={`rounded-xl border p-4 transition-all ${
                locked
                  ? "opacity-50 border-border bg-muted/30"
                  : course.completed
                  ? "border-success/40 bg-success/5"
                  : "border-primary/20 bg-card hover:shadow-md hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {course.completed ? (
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
                        {course.completedLessons}/{course.totalLessons}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={course.completed ? "default" : "secondary"} className={course.completed ? "bg-success text-success-foreground" : ""}>
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
