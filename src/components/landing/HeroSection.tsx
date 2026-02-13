import { motion } from "framer-motion";
import { ArrowDown, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users } from "lucide-react";

const HeroSection = () => (
  <section
    id="hero"
    className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden"
  >
    {/* Gradiente branco + rosa suave */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-white to-white" />

    {/* Glow rosa suave */}
    <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-rose-300/20 blur-3xl" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Users size={16} />
          Para trabalhadores informais de 18 a 55 anos
        </div>

        {/* Título */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Sua renda é real.{" "}
          <span className="text-primary">
            Seu crédito também deveria ser.
          </span>
        </h1>

        {/* Descrição */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          O Score Complementar Comportamental avalia sua regularidade e compromisso financeiro, criando um novo caminho para inclusão no mercado de crédito.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-base px-8 py-6 font-semibold bg-primary hover:bg-primary text-white shadow-lg shadow-primary"
            asChild
          >
            <a href="#cta-final">
              <TrendingUp size={20} />
             Quero Participar
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 font-semibold border-primary text-primary hover:bg-primary"
            asChild
          >
            <a href="#video">Entenda o Programa</a>
          </Button>
        </div>

      </div>
    </div>
  </section>
);

export default HeroSection;
