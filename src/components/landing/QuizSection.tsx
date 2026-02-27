import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

interface Question {
  q: string;
  options: { label: string; points: number }[];
}

const questions: Question[] = [
  {
    q: "Qual é sua principal fonte de renda?",
    options: [
      { label: "CLT / emprego formal", points: 1 },
      { label: "Freelancer / autônomo", points: 3 },
      { label: "Vendas informais (brechó, doces, etc.)", points: 4 },
      { label: "Bicos e trabalhos esporádicos", points: 5 },
    ],
  },
  {
    q: "Você já tentou pedir crédito e foi negado?",
    options: [
      { label: "Nunca tentei", points: 2 },
      { label: "Sim, uma vez", points: 3 },
      { label: "Sim, mais de uma vez", points: 5 },
      { label: "Não, fui aprovado", points: 1 },
    ],
  },
  {
    q: "Você paga contas (aluguel, luz, internet) no seu nome?",
    options: [
      { label: "Sim, todas", points: 4 },
      { label: "Algumas delas", points: 3 },
      { label: "Não, estão em nome de outra pessoa", points: 5 },
      { label: "Não tenho contas fixas", points: 2 },
    ],
  },
  {
    q: "Com que frequência você usa PIX para receber?",
    options: [
      { label: "Todos os dias", points: 5 },
      { label: "Toda semana", points: 4 },
      { label: "De vez em quando", points: 2 },
      { label: "Raramente", points: 1 },
    ],
  },
  {
    q: "Você consegue comprovar sua renda de alguma forma?",
    options: [
      { label: "Sim, com holerite ou nota fiscal", points: 1 },
      { label: "Tenho recibos e comprovantes PIX", points: 3 },
      { label: "Tenho extratos bancários apenas", points: 4 },
      { label: "Não consigo comprovar", points: 5 },
    ],
  },
];

const getResult = (score: number) => {
  if (score >= 20) return {
    title: "🔴 CPF Altamente Invisível",
    message: "O sistema financeiro não te enxerga — mas a Renda Visível pode mudar isso. Você é exatamente quem podemos ajudar.",
    color: "text-primary",
  };
  if (score >= 14) return {
    title: "🟡 CPF Parcialmente Invisível",
    message: "Você tem potencial financeiro que não está sendo reconhecido. Com a Renda Visível, seu score alternativo pode abrir portas.",
    color: "text-yellow-500",
  };
  return {
    title: "🟢 CPF com Potencial Visível",
    message: "Você já tem alguma visibilidade, mas a Renda Visível pode ampliar seu acesso a crédito com dados mais completos.",
    color: "text-green-500",
  };
};

const QuizSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (points: number) => {
    const newAnswers = [...answers, points];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setFinished(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const result = getResult(totalScore);

  return (
    <section id="quiz" className="py-20 md:py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Quiz interativo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Seu CPF é <span className="text-primary">invisível</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            Responda 5 perguntas rápidas e descubra.
          </p>
        </motion.div>

        <div className="bg-card rounded-3xl shadow-card border border-border p-8 md:p-12">
          {!finished ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-2">Pergunta {step + 1} de {questions.length}</p>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-6">
                  {questions[step].q}
                </h3>

                <div className="flex flex-col gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(opt.points)}
                      className="text-left px-5 py-4 rounded-xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-foreground font-medium flex items-center justify-between group"
                    >
                      {opt.label}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${result.color}`} />
              <h3 className={`font-display text-2xl font-bold mb-3 ${result.color}`}>
                {result.title}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">{result.message}</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={() => document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-primary text-primary-foreground px-6"
                >
                  Quero meu score alternativo
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Refazer quiz
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
