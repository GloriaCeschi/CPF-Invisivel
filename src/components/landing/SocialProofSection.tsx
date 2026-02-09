import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Ana, 22 anos", role: "Vendedora online", quote: "Eu fazia R$ 3.000/mês vendendo doces, mas nenhum banco acreditava em mim. Com a MaskID, finalmente consegui meu primeiro cartão.", avatar: "A" },
  { name: "Lucas, 19 anos", role: "Freelancer de design", quote: "Trabalho com design desde os 16, mas nunca tive como provar minha renda. O score alternativo mudou minha vida.", avatar: "L" },
  { name: "Mariana, 25 anos", role: "Cabeleireira autônoma", quote: "Pagava aluguel, luz e internet — tudo no meu nome. Mas meu score era zero. A MaskID reconheceu meu esforço.", avatar: "M" },
  { name: "Pedro, 21 anos", role: "Motorista de app", quote: "Rodava 12 horas por dia, mas quando fui pedir crédito me trataram como se eu não existisse. Agora é diferente.", avatar: "P" },
];

const partners = ["Banco Futuro", "FinTech+", "CréditoJá", "NeoBank", "PaySmart"];

const SocialProofSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="social" className="py-20 md:py-28 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Quem já saiu da <span className="text-gradient">invisibilidade</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-float transition-shadow"
            >
              <Quote className="w-8 h-8 text-secondary/30 mb-3" />
              <p className="text-foreground text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-center mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: "12.500+", l: "Jovens cadastrados" },
              { n: "85%", l: "Aprovação de crédito" },
              { n: "R$ 2.8M", l: "Crédito liberado" },
              { n: "4.9/5", l: "Satisfação média" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{s.n}</div>
                <div className="text-primary-foreground/60 text-sm mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm mb-6">Parceiros e certificações</p>
          <div className="flex flex-wrap justify-center gap-8">
            {partners.map((p) => (
              <div key={p} className="px-6 py-3 bg-card rounded-xl border border-border text-muted-foreground font-medium text-sm">
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
