import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

const VideoSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoId = "tu0QZ5YRjMY";
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section id="video" className="py-20 md:py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Entenda o programa
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Veja como a <span className="text-primary">Renda Visível</span> funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Assista ao vídeo e entenda como podemos tornar sua renda visível para o sistema financeiro.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="aspect-video rounded-3xl border border-border shadow-card overflow-hidden relative bg-black"
        >
          {!isVideoOpen ? (
            <button
              onClick={() => setIsVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer group w-full h-full"
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 w-24 h-24 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-10 h-10 text-primary-foreground ml-1" fill="white" />
              </div>
            </button>
          ) : (
            <>
              <div className="absolute inset-0 bg-black overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&fs=1&controls=1&iv_load_policy=3`}
                  title="Como funciona a Renda Visível"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                  style={{
                    border: "none",
                  }}
                />
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
