import { Lock, Play, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { VideoModal } from "./VideoModal";

export interface CourseData {
  id: number;
  title: string;
  description: string;
  progress: number;
  locked: boolean;
  lockReason?: string;
  category: string;
  videoUrl?: string;
}

interface CourseCardProps {
  course: CourseData;
  onComplete?: () => void;
  onProgressSave?: (course: CourseData) => void;
}

export function CourseCard({ course, onComplete, onProgressSave }: CourseCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isComplete = course.progress === 100;

  const getYouTubeVideoId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(course.videoUrl);

  const thumbnail = (
    <div
      className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={() => course.videoUrl && setModalOpen(true)}
    >
      {videoId ? (
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={`Thumbnail de ${course.title}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : isComplete ? (
        <CheckCircle className="h-10 w-10 text-success" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform group-hover:scale-110">
          <Play className="h-5 w-5 ml-0.5" />
        </div>
      )}
      {course.videoUrl && (
        <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-black/60 text-white">
          🎬 Vídeo
        </span>
      )}
      {videoId && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Play className="h-12 w-12 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${course.id * 80}ms` }}>
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
            {thumbnail}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${isComplete ? "bg-success/20 text-success" : "bg-info/20 text-info"
                    }`}
                >
                  {isComplete ? "✅ Concluído" : "Disponível"}
                </span>
                <span className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-secondary/20 text-secondary">
                  {course.category}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground line-clamp-2">{course.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{course.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {course.videoUrl && (
        <VideoModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          videoUrl={course.videoUrl}
          title={course.title}
          courseId={course.id}
          onCourseCompleted={() => {
            onProgressSave?.(course);
            onComplete?.();
          }}
        />
      )}

    </div>
  );
}
