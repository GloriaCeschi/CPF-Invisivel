import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Sparkles } from "lucide-react";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="cta" className="py-20 md:py-28 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-hero rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(322_80%_50%/0.2),transparent_50%)]" />
              <div className="relative z-10">
                <Sparkles className="w-12 h-12 text-secondary mb-6" />
                <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
                  Passe a existir financeiramente hoje
                </h3>
                <p className="text-primary-foreground/70 text-lg mb-6">
                  Cadastre-se gratuitamente e comece a construir seu score alternativo agora mesmo.
                </p>
                <div className="flex flex-col gap-3">
                  {["Sem taxas de cadastro", "100% online e seguro", "Resultado em semanas"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-primary-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
              {!submitted ? (
                <>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    Comece agora
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Preencha seus dados e receba acesso antecipado.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo</label>
                      <Input placeholder="Seu nome" required className="rounded-xl h-12" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail</label>
                      <Input type="email" placeholder="seu@email.com" required className="rounded-xl h-12" />
                    </div>
                    <Button type="submit" size="lg" className="bg-gradient-cta text-primary-foreground w-full rounded-xl h-12 mt-2">
                      Quero participar
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Seus dados estão seguros. Não compartilhamos com terceiros.
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Cadastro recebido! 🎉</h3>
                  <p className="text-muted-foreground">Você será um dos primeiros a construir seu score alternativo.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
