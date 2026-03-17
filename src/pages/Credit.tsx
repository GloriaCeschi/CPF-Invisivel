import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react"
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";



function solicitar(nomeBanco: string) {
  toast({
    title: "Solicitação enviada com sucesso!",
    description: "O Banco " + nomeBanco + " irá analisar seu pedido.",
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


export type banks = {
  id: string,
  cnpj?: string,
  name?: string,
  credit?: string,
  interest?: number,
  max_amount?: number,
  max_term?: number,
  criator_id: string
}

export type Service = {
  id: string,
  service: string,
  credit_limit: string,
  interest_rate: string,
  criator_id: string
}

export default function BancosParceiros() {
  const [chatOpen, setChatOpen] = useState(false);
  const { user, signOutUser } = useAuth();



  const [valor, setValor] = useState("3000");
  const [prazo, setPrazo] = useState("12");
  const [taxa, setTaxa] = useState("3.1");

  const [banks, Setbanks] = useState<banks[]>([]);

  useEffect(() => {
    if (user) syncCredit(user.id);
  }, []);

  async function syncCredit(user_id: string): Promise<void> { //"void" é 
    const { data, error } = await supabase.from('banks')
      .select('*').eq("user_id", user_id);

    if (error) {
      alert(error.message)
      return
    }

    Setbanks(data) // "data" é dados

  }

  const valorNum = parseFloat(valor) || 0;
  const taxaNum = parseFloat(taxa) / 100;
  const prazoNum = parseInt(prazo) || 1;
  const parcela =
    taxaNum > 0
      ? (valorNum * taxaNum * Math.pow(1 + taxaNum, prazoNum)) /
      (Math.pow(1 + taxaNum, prazoNum) - 1)
      : valorNum / prazoNum;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-hsl">
        {/* LOGO */}
        <div className="flex items-center gap-3 p-5">

        </div>

        {/* TÍTULO */}
        <h2 className="text-center text-xl font-semibold text-foreground mb-2">
          Bancos Parceiros
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10 px-4">
          Compare taxas, limites e prazos entre nossos bancos parceiros < br />
          e enconre o crédito ideal para a sua realidade.
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
            <div className="text-center mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Simulação
              </h3>
              <h2 className="text-lg font-semibold text-gray-800 mt-1">
                Simule seu empréstimo
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Descubra o valor aproximado da sua parcela.
            </p>

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
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Total a pagar
                  </p>
                  <p className="text-sm font-bold text-foreground ">
                    R$ {parcela}
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-green-50 p-3 rounded-lg text-center">
                <p className="text-sm text-green-600 font-medium">
                  ✔ Pré-aprovado
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
      </div>

      <div className="text-center mt-10 mb-10">

        <h3 className="text-lg font-semibold text-foreground mb-4">
          Por que usar a Renda Visível?
        </h3>

        <p className="text-gray-500">
          ✔ Compare opções de crédito em um só lugar
        </p>

        <p className="text-gray-500">
          ✔ Simulação rápida e transparente
        </p>

        <p className="text-gray-500">
          ✔ Processo simples e seguro
        </p>

      </div>

      <footer className="bg-foreground text-white text-center p-6 mt-10">
        <p className="text-sm">
          🔒 Seus dados são protegidos e utilizados apenas para análise de crédito.
        </p>
        <p className="font-semibold mt-2">
          Renda Visível — Todos os direitos reservados.
        </p>
      </footer>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {chatOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-80 bg-white rounded-2xl shadow-lg border overflow-hidden">

          <div className="bg-primary p-4 flex justify-between items-center">
            <span className="text-white font-semibold text-sm">
              Renda Visível Assistente
            </span>

            <button onClick={() => setChatOpen(false)}>
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-sm text-foreground">
              Olá! 👋 Como posso ajudar você hoje?
            </p>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
