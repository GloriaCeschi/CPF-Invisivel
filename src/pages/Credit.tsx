import { useState } from "react";
import { MessageCircle, X } from "lucide-react"
import { toast } from "@/hooks/use-toast";

function solicitar(nomeBanco: string) {
  toast({
    title: "Solicitação enviada com sucesso!",
    description: "O banco " + nomeBanco + " irá analisar seu pedido.",
  });
}

const bancos = [
  {
    nome: "Caixa Econômica Fedeal",
    icone: "🏦",
    taxa: "2.5% ao mês",
    limite: "R$ 5.000",
    prazo: "12 meses",
    vantagens: ["Aprovação rápida", "Sem burocracia", "Resposta em até 48h"],
  },
  {
    nome: "Banco Inter",
    icone: "💳",
    taxa: "3.1% ao mês",
    limite: "R$ 8.000",
    prazo: "18 meses",
    vantagens: ["Crédito imediato", "Análise simples", "Parcelas flexíveis"],
  },
  {
    nome: "Nubank",
    icone: "🟣",
    taxa: "2.8% ao mês",
    limite: "R$ 6.500",
    prazo: "15 meses",
    vantagens: ["Ideal para pequenos negócios", "Taxas reduzidas"],
  },
];

interface DataRowProps {
  label: string;
  value: string;
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <p className="text-sm text-card-foreground">
      <span className="font-bold">{label}:</span> {value}
    </p>
  );
}

export default function BancosParceiros() {
const [chatOpen, setChatOpen] = useState(false);


  const [valor, setValor] = useState("3000");
  const [prazo, setPrazo] = useState("12");
  const [taxa, setTaxa] = useState("3.1");

  const valorNum = parseFloat(valor) || 0;
  const taxaNum = parseFloat(taxa) / 100;
  const prazoNum = parseInt(prazo) || 1;
  const parcela =
    taxaNum > 0
      ? (valorNum * taxaNum * Math.pow(1 + taxaNum, prazoNum)) /
        (Math.pow(1 + taxaNum, prazoNum) - 1)
      : valorNum / prazoNum;

  return (
    <div className="min-h-screen bg-background">
      {/* LOGO */}
      <div className="flex items-center gap-3 p-5">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="font-semibold text-gary text-foreground">
          Renda<span className="text-primary">Visível</span>
        </span>
      </div>

      {/* TÍTULO */}
      <h2 className="text-center text-xl font-semibold text-foreground mb-2">
        Bancos Parceiros
      </h2>
      <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10 px-4">
        Compare taxas, limites e prazos dos bancos parceiros e solicite o
        empréstimo que melhor se adapta à sua realidade.
      </p>

      {/* CARDS */}
      <div className="flex justify-center gap-6 flex-wrap px-6 pb-8">
        {bancos.map((banco, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-xl w-[280px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-card-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl text-primary">{banco.icone}</span>
              <h3 className="text-base font-semibold text-card-foreground">
                {banco.nome}
              </h3>
            </div>

            <div className="space-y-1 mb-4">
              <DataRow label="Taxa" value={banco.taxa} />
              <DataRow label="Limite" value={banco.limite} />
              <DataRow label="Prazo" value={banco.prazo} />
            </div>

            <div className="space-y-1 mb-5">
              {banco.vantagens.map((v, i) => (
                <p key={i} className="text-sm text-card-foreground">
                  <span className="text-primary">✔</span> {v}
                </p>
              ))}
            </div>

            <button
              onClick={() => solicitar(banco.nome)}
              className="w-full bg-primary text-primary-foreground border-none py-2.5 rounded-lg cursor-pointer font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Solicitar Empréstimo
            </button>
          </div>
        ))}
      </div>

      {/* SIMULADOR */}
      <div className="max-w-2xl mx-auto px-6 pb-12">
        <div className="bg-card p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-card-border">
          <h3 className="text-xl font-semibold text-card-foreground mb-5">
            Simular Empréstimo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Valor desejado
              </label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Prazo
              </label>
              <select
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="18">18 meses</option>
                <option value="24">24 meses</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Taxa
              </label>
              <select
                value={taxa}
                onChange={(e) => setTaxa(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="2.5">2.5%</option>
                <option value="2.8">2.8%</option>
                <option value="3.1">3.1%</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-sm text-muted-foreground">
                Parcela estimada
              </span>
              <p className="text-2xl font-bold text-foreground">
                R$ {parcela.toFixed(0)}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  / mês
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                toast({
                  title: "Solicitação enviada!",
                  description:
                    "Sua simulação foi registrada. Entraremos em contato.",
                });
            }}
              className="bg-primary text-primary-foreground border-none py-2.5 px-6 rounded-lg cursor-pointer font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Confirmar Solicitação
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-[#1e3a5f] text-white p-6 text-center mt-10">
        © 2025 Renda Visível. Todos os direitos reservados.
</footer>
    </div>
);
}
