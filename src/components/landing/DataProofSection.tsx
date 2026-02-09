import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const barData = [
  { name: "Formais", valor: 54 },
  { name: "Informais", valor: 39 },
  { name: "Sem acesso", valor: 29 },
];

const pieData = [
  { name: "Com crédito", value: 45 },
  { name: "Sem crédito", value: 55 },
];

const COLORS = ["hsl(220 72% 25%)", "hsl(322 80% 50%)"];

const stats = [
  { number: "39M+", label: "Brasileiros na informalidade" },
  { number: "55%", label: "Sem acesso a crédito" },
  { number: "R$0", label: "Score reconhecido" },
];

const DataProofSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="dados" className="py-20 md:py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Dados reais
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            O Brasil que o sistema <span className="text-gradient">não enxerga</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Milhões de pessoas geram renda, pagam contas e movimentam a economia — mas continuam invisíveis para o crédito tradicional.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="bg-card rounded-2xl p-8 text-center shadow-card border border-border"
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Trabalhadores no Brasil (milhões)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
                <Tooltip />
                <Bar dataKey="valor" fill="hsl(220 72% 25%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-card rounded-2xl p-6 shadow-card border border-border"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Acesso a crédito na informalidade
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataProofSection;
