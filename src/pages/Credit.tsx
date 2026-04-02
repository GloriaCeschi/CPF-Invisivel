import { useEffect, useState } from "react";
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
  user_id: string
}

export type Service = {
  id: string,
  service: string,
  credit_limit: string,
  interest_rate: string,
  criator_id: string
}



export default function BancosParceiros() {

  const { user } = useAuth();

  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("12");
  const [taxa, setTaxa] = useState("3.1");

  const [banks, setBanks] = useState<banks[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const listaBancos = banks;
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user?.id) {
      syncCredit(user.id);
      buscarHistorico();
    }
  }, [user]);




  async function syncCredit(user_id: string): Promise<void> {
    const { data, error } = await supabase
      .from('banks')
      .select('*');

    console.log("dados do supabase:", data);

    if (error) {
      alert(error.message);
      return;
    }

    setBanks(
      (data || []).sort((a, b) => {
        const ordem = ["Caixa Econômica Federal", "Banco Inter", "Nubank"];
        return ordem.indexOf(a.name) - ordem.indexOf(b.name);
      })
    );
    setLoading(false);
  }
  async function buscarHistorico() {
    if (!user) return;

    const { data, error } = await supabase
      .from("simulations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("erro historico:", error);
      return;
    }

    setHistorico(data || []);
  }


  const valorNum = parseFloat(valor) || 0;
  const taxaNum = parseFloat(taxa) / 100;
  const prazoNum = parseInt(prazo) || 1;
  const parcela =
    taxaNum > 0
      ? (valorNum * taxaNum * Math.pow(1 + taxaNum, prazoNum)) /
      (Math.pow(1 + taxaNum, prazoNum) - 1)
      : valorNum / prazoNum;


  const melhorBanco = [...banks].sort(
    (a, b) => (a.interest ?? 999) - (b.interest ?? 999)
  )[0];



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
          Compare taxas, limites e prazos entre nossos bancos parceiros <br />
          e enconre o crédito ideal para a sua realidade.
        </p>

        {/* CARDS */}

        <div className="flex justify-center gap-6 flex-wrap px-6 pb-8">
          {listaBancos.map((banco: any, index) => (
            <div
              key={banco.id || index}
              className={`p-6 rounded-2xl w-[280px] transition-all duration-300
  ${banco.id === melhorBanco?.id
                  ? "bg-white border-2 border-primary shadow-xl"
                  : "bg-card border border-pink-100 shadow-md hover:shadow-lg hover:-translate-y-1"
                }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl text-primary">
                  {banco.name?.includes("Caixa")
                    ? "🏦"
                    : banco.name?.includes("Inter")
                      ? "💳"
                      : banco.name?.includes("Nubank")
                        ? "🟣"
                        : "🏦"}
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                    {banco.name}
                    {banco.id === melhorBanco?.id && (
                      <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                        MELHOR OPÇÃO
                      </span>
                    )}
                  </h3>
                </div>
              </div>


              <div className="space-y-1 mb-4">
                <DataRow
                  label="Taxa"
                  value={
                    banco.interest
                      ? banco.interest + "% ao mês"
                      : banco.taxa
                  }
                />

                <DataRow
                  label="Limite"
                  value={
                    banco.max_amount

                      ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(banco.max_amount)
                      : banco.limite
                  }
                />

                <DataRow
                  label="Prazo"
                  value={
                    banco.max_term
                      ? banco.max_term + " meses"
                      : banco.prazo
                  }
                />
              </div>

              <div className="space-y-1 mb-5">
                {(banco.vantagens || [
                  "Aprovação rápida",
                  "Sem burocracia",
                  "Resposta rápida"
                ]).map((v: any, i: number) => (
                  <p key={i} className="text-sm text-card-foreground">
                    <span className="text-primary">✔</span> {v}
                  </p>
                ))}
              </div>

              <button
                onClick={() => solicitar(banco.name || banco.nome)}
                className="w-full mt-4 bg-primary text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
              >
                Solicitar Empréstimo
              </button>
            </div>
          ))}
        </div>
        {/* SIMULADOR */}
        <div className="max-w-2xl mx-auto px-6 pb-12">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
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
                  onChange={(e) => setPrazo((e.target.value))}
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
                  onChange={(e) => setTaxa((e.target.value))}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="2.5">2.5%</option>
                  <option value="2.8">2.8%</option>
                  <option value="3.1">3.1%</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="text-xs text-muted-foreground">
                  Parcela estimada
                </span>

                <p className="text-3xl font-bold text-foreground">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(parcela)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / mês
                  </span>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Total:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(parcela * prazoNum)}
                </p>
              </div>

              <div className="mt-3 bg-green-50 p-3 rounded-lg text-center">
                <p className="text-sm text-green-600 font-medium">
                  ✔ Pré-aprovado
                </p>
              </div>

              <button
                onClick={async () => {
                  console.log("clicou botão");
                  console.log("user:", user);

                  if (!user) return;

                  const { error } = await supabase.from("simulations").insert([
                    {
                      user_id: user.id,
                      user_name: user.email?.split("@")[0],
                      valor: valorNum,
                      prazo: prazoNum,
                      parcela: parcela,
                      status: "Em análise",
                    },
                  ]);

                  console.log("erro:", error);

                  if (error) {
                    toast({
                      title: "Erro ao salvar",
                      description: error.message,
                    });
                    return;
                  }
                  await buscarHistorico();
                  toast({
                    title: "Solicitação enviada!",
                    description: "Sua simulação foi registrada e está em análise.",
                  });
                }}
                className="bg-primary text-white border-none py-2.5 px-6 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 hover:brightness-95 active:scale-95 active:brightness-90"
              >
                Confirmar Solicitação
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* HISTÓRICO */}
      <div className="max-w-2xl mx-auto px-6 pb-12">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Histórico de Solicitações
        </h3>

        {historico.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma solicitação ainda.
          </p>
        ) : (
          historico.slice(0, 1).map((item) => (
            <div
              key={item.id}
              className="bg-zinc-50 p-4 rounded-xl shadow-md mb-3 border border-zinc-200"
            >
              <p className="text-card-foreground text-sm">
                <strong>Nome:</strong> {item.user_name}
              </p>

              <p className="text-card-foreground text-sm">
                <strong>Valor:</strong> R$ {item.valor}
              </p>

              <p className="text-card-foreground text-sm">
                <strong>Prazo:</strong> {item.prazo} meses
              </p>

              <p className="text-card-foreground text-sm">
                <strong>Status:</strong> {item.status}
              </p>

              <p className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>



    </DashboardLayout >
  );
}
