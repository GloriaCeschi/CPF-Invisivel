import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, FileText, Smartphone, Brain, CreditCard, Shield, Zap, Globe, TrendingUp, Users } from "lucide-react";

const solutions = [
  { icon: Star, front: "Score Alternativo", back: "Criamos um score baseado nos seus hábitos financeiros reais: contas pagas, receitas recorrentes e comportamento digital." },
  { icon: FileText, front: "Cadastro Voluntário", back: "Você envia comprovantes de renda, recibos e extratos de PIX para construir seu perfil financeiro." },
  { icon: Brain, front: "IA para Validação", back: "Inteligência artificial analisa e valida seus documentos automaticamente, sem burocracia." },
  { icon: Smartphone, front: "Integração PIX", back: "Seu histórico de PIX mostra a movimentação real da sua renda, validando seus ganhos." },
  { icon: CreditCard, front: "Crédito Gradual", back: "Comece com limites menores e aumente conforme seu score alternativo cresce." },
  { icon: Shield, front: "Dados Protegidos", back: "Seus dados são criptografados e você controla quem acessa suas informações." },
  { icon: Zap, front: "Resultado Rápido", back: "Em poucas semanas, seu perfil financeiro começa a tomar forma no sistema." },
  { icon: Globe, front: "Parceiros Inclusivos", back: "Conectamos você a bancos e fintechs que aceitam o score alternativo MaskID." },
  { icon: TrendingUp, front: "Gamificação", back: "Envie mais provas, complete desafios e veja seu score subir — como um jogo!" },
  { icon: Users, front: "Comunidade", back: "Faça parte de uma rede de jovens que estão construindo seu futuro financeiro juntos." },
];

const FlipCard = ({ card, index, inView }: { card: typeof solutions[0]; index: number; inView: boolean }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="flip-card h-56 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`flip-card-inner relative w-full h-full ${flipped ? "[transform:rotateY(180deg)]" : ""}`} style={{ transformStyle: "preserve-3d", transition: "transform 0.6s" }}>
        {/* Front */}
        <div className="flip-card-front absolute inset-0 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-card" style={{ backfaceVisibility: "hidden" }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
            <card.icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <h3 className="font-display font-semibold text-foreground text-center">{card.front}</h3>
          <span className="text-muted-foreground text-xs mt-2">Clique para saber mais →</span>
        </div>
        {/* Back */}
        <div className="flip-card-back absolute inset-0 bg-gradient-hero rounded-2xl p-6 flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-primary-foreground text-sm leading-relaxed text-center">{card.back}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SolutionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="solucao" className="py-20 md:py-28 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            A solução
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            De <span className="text-gradient">invisível</span> a protagonista financeiro
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A MaskID conecta sua vida financeira real ao sistema de crédito. Toque nos cards para entender como.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {solutions.map((s, i) => (
            <FlipCard key={s.front} card={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
