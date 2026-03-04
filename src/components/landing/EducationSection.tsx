import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BookOpen, Gamepad2, MessageCircle, Trophy, Target, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  { icon: BookOpen, title: "Organização Financeira", desc: "Aprenda a controlar seus ganhos informais e criar uma reserva." },
  { icon: Target, title: "Crédito Consciente", desc: "Entenda como funciona o crédito e como usá-lo a seu favor." },
  { icon: Lightbulb, title: "Empreendedorismo", desc: "Formalize sua renda e escale seus ganhos com dicas práticas." },
];

const gamification = [
  { icon: Trophy, label: "Envie comprovantes", points: "+10 pts" },
  { icon: Trophy, label: "Complete cursos", points: "+25 pts" },
  { icon: Trophy, label: "Convide amigos", points: "+15 pts" },
  { icon: Trophy, label: "Mantenha streak", points: "+5 pts/dia" },
];

const EducationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <section id="educacao" className="py-20 md:py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Educação financeira
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Aprenda, jogue e <span className="text-primary">cresça</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Cursos gratuitos, gamificação e suporte para você dominar suas finanças.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Courses */}
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Cursos disponíveis
            </h3>
            <div className="flex flex-col gap-4">
              {courses.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="bg-card rounded-xl p-5 border border-border shadow-card flex items-start gap-4 hover:shadow-float transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{c.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{c.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gamification */}
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" /> Gamificação
            </h3>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <p className="text-muted-foreground text-sm mb-5">
                Cada ação que você realiza aumenta seu score interno. Quanto mais engajado, mais crédito!
              </p>
              <div className="flex flex-col gap-3">
                {gamification.map((g, i) => (
                  <motion.div
                    key={g.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between py-3 px-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <g.icon className="w-5 h-5 text-primary" />
                      <span className="text-foreground text-sm font-medium">{g.label}</span>
                    </div>
                    <span className="text-primary font-bold text-sm">{g.points}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot FAB */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full shadow-float flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card rounded-2xl shadow-float border border-border overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground font-semibold text-sm">Renda Visível Assistente</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 h-48 flex flex-col justify-end">
            <div className="bg-muted rounded-xl rounded-bl-none p-3 mb-3 max-w-[85%]">
              <p className="text-foreground text-sm">Olá! 👋 Eu sou o assistente da Renda Visível. Como posso te ajudar hoje?</p>
            </div>
            <div className="bg-muted rounded-xl rounded-bl-none p-3 max-w-[85%]">
              <p className="text-foreground text-sm">Posso tirar dúvidas sobre score alternativo, cadastro e muito mais!</p>
            </div>
          </div>
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground text-sm outline-none border border-border focus:border-primary"
                readOnly
              />
              <Button size="sm" className="bg-primary text-primary-foreground">
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EducationSection;
