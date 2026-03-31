import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  title: string;
  courseId: number;
  onCourseCompleted?: () => void;
}

export function VideoModal({ open, onOpenChange, videoUrl, title, courseId, onCourseCompleted }: VideoModalProps) {
  const { user } = useAuth();

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  const saveProgress = async (progressValue: number) => {
    if (!user) return;
    await supabase
      .from("courses_progress")
      .upsert({
        user_id: user.id,
        course_id: courseId,
        progress: progressValue,
      });
  };

  const handleClose = async (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      await saveProgress(100);
      onCourseCompleted?.();
    }
  };

  if (!embedUrl) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full" style={{ backgroundColor: '#FFF1F2' }}>
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src={`${embedUrl}?rel=0&autoplay=1`}
            title={`Vídeo de ${title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
