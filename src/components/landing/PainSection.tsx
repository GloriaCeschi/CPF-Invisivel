import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserX, Wallet, Home, BarChart3, Smartphone } from "lucide-react";

const problems = [
  {
    icon: UserX,
    title: "Dependência familiar",
    description: "Jovens precisam usar o CPF de parentes para qualquer compra parcelada ou contrato.",
  },
  {
    icon: Wallet,
    title: "Renda não reconhecida",
    description: "Freelas, vendas e bicos geram renda real — mas nenhum banco reconhece.",
  },
  {
    icon: Home,
    title: "Contas ignoradas",
    description: "Aluguel, luz e internet pagos em dia não constroem nenhum histórico de crédito.",
  },
  {
    icon: BarChart3,
    title: "Análise rígida",
    description: "O sistema de score atual só funciona para quem já está dentro do sistema financeiro.",
  },
  {
    icon: Smartphone,
    title: "Exclusão digital",
    description: "Sem score, sem crédito, sem conta digital — um ciclo de invisibilidade financeira.",
  },
];

const PainSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problema" className="relative py-20 md:py-28 overflow-hidden" ref={ref}>
      {/* Parallax dark bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-maskid-dark to-primary parallax" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(322_80%_50%/0.08),transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            O problema
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            O CPF <span className="text-secondary">Invisível</span>
          </h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto text-lg">
            Para o sistema financeiro, se você não tem score, você simplesmente não existe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 hover:bg-primary-foreground/10 transition-all group shadow-float"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                <p.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-primary-foreground mb-2">{p.title}</h3>
              <p className="text-primary-foreground/50 text-sm leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainSection;
