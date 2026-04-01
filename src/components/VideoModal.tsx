import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

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
  const playerRef = useRef<any>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  useEffect(() => {
    if (open && videoId) {
      // Load YouTube API if not loaded
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Initialize player when API is ready
      const initPlayer = () => {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            rel: 0,
          },
          events: {
            onStateChange: onPlayerStateChange,
            onReady: onPlayerReady,
          },
        });
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [open, videoId]);

  const onPlayerReady = (event: any) => {
    // Player is ready
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === (window as any).YT.PlayerState.ENDED) {
      setCurrentProgress(100);
      setIsCompleted(true);
      saveProgress(100);
      onCourseCompleted?.();
    }
  };

  const saveProgress = async (progressValue: number) => {
    if (!user) return;
    
    // Se o progresso é 100%, marca como concluído e soma pontos usando RPC
    if (progressValue === 100) {
      const { error } = await supabase.rpc("complete_course", {
        uid: user.id,
        p_course_id: courseId,
        pts: 25,
      });
      
      if (error) {
        console.error("Erro ao completar curso:", error);
      }
    } else {
      // Se não é 100%, apenas atualiza o progresso
      await supabase
        .from("courses_progress")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress: progressValue,
          completed_at: null,
        });
    }
  };

  const handleClose = async (open: boolean) => {
    if (!open && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
      setCurrentProgress(progress);
      await saveProgress(progress);
      // Only mark as completed if progress is 100%
      if (progress === 100 && !isCompleted) {
        setIsCompleted(true);
        onCourseCompleted?.();
      }
    }
    onOpenChange(open);
  };

  if (!videoId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full" style={{ backgroundColor: '#FFF1F2' }}>
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <div id="youtube-player" className="w-full h-full rounded-lg"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
