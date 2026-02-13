import { motion } from "framer-motion";
import { ArrowDown, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingCards = [
  { icon: Shield, label: "Score Alternativo", delay: 0 },
  { icon: TrendingUp, label: "Crédito Justo", delay: 0.2 },
  { icon: Users, label: "Inclusão Real", delay: 0.4 },
];

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* BG solid pink */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(322_80%_60%/0.3),transparent_60%)]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/80 text-sm font-medium mb-6 border border-primary-foreground/20">
            🚀 Inclusão financeira para quem realmente precisa
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 max-w-4xl mx-auto leading-tight"
        >
          Sua renda é real.{" "}
          <span className="text-primary-foreground/80">
            Seu crédito também deveria ser.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10"
        >
          Milhões de brasileiros com renda informal são invisíveis para o sistema financeiro. 
          A Renda Visível está mudando isso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            onClick={() => scrollTo("#cta")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 py-6 rounded-xl shadow-float font-semibold"
          >
            Quero participar
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("#video")}
            className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 py-6 rounded-xl"
          >
            Entenda o programa
          </Button>
        </motion.div>

        {/* Floating Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + card.delay }}
              className={`bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer hover:bg-primary-foreground/15 transition-all ${
                i % 2 === 0 ? "animate-float" : "animate-float-delayed"
              }`}
            >
              <card.icon className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground font-medium text-sm">{card.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button onClick={() => scrollTo("#dados")} className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
