import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";







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

  const [valor, setValor] = useState("0");
  const [prazo, setPrazo] = useState("12");
  const [taxa, setTaxa] = useState("3.1");

  const [banks, setBanks] = useState<banks[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");
  const listaBancos = [...banks].sort((a, b) => {
    const jurosA = a.interest ?? 999;
    const jurosB = b.interest ?? 999;

    if (jurosA !== jurosB) {
      return jurosA - jurosB;
    }

    return (a.max_term ?? 999) - (b.max_term ?? 999);
  });
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);


  useEffect(() => {
    if (user?.id) {
      buscarNomeUsuario();
      syncCredit(user.id);
      buscarHistorico();
    }
  }, [user]);

  async function buscarNomeUsuario() {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('name').eq('user_id', user.id).maybeSingle();
    if (data?.name) {
      setUserName(data.name);
    } else {
      const emailName = user.email?.split("@")[0] || "Usuário";
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
    }
  }




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

  async function handleSolicitarBanco(banco: any) {
    if (!user) return;
    
    const valorNum = banco.max_amount || 0;
    const taxaNum = (banco.interest || 0) / 100;
    const prazoNum = banco.max_term || 1;

    const parcela =
      taxaNum > 0
        ? (valorNum * taxaNum * Math.pow(1 + taxaNum, prazoNum)) /
        (Math.pow(1 + taxaNum, prazoNum) - 1)
        : valorNum / prazoNum;

    const { error } = await supabase.from("simulations").insert([
      {
        user_id: user.id,
        user_name: userName || (
          user.email?.split("@")[0]?.charAt(0).toUpperCase() +
          user.email?.split("@")[0]?.slice(1)
        ),
        valor: valorNum,
        prazo: prazoNum,
        parcela: parcela,
        status: "Em análise",
        bank_name: banco.name || banco.nome,
      },
    ]);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
      });
      return;
    }

    await supabase.from("notifications").insert([
      {
        user_id: user.id,
        type: "simulacao",
        message: `A sua solicitação de empréstimo no banco ${banco.name || banco.nome} no valor de ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valorNum)} foi enviada com sucesso e passará por análise. Em breve você receberá atualizações.`,
        viewed: false,
        archived: false,
      },
    ]);

    await buscarHistorico();

    toast({
      title: "Solicitação enviada com sucesso!",
      description: "O Banco " + (banco.name || banco.nome) + " irá analisar seu pedido.",
    });
  }


  const melhorBanco = [...banks].sort(
    (a, b) => (a.interest ?? 999) - (b.interest ?? 999)
  )[0];

  const valorNum = (parseFloat(valor) || 0) / 100;

  const taxaNum = parseFloat(taxa) / 100;
  const prazoNum = parseInt(prazo) || 1;

  const parcela =
    taxaNum > 0
      ? (valorNum * taxaNum * Math.pow(1 + taxaNum, prazoNum)) /
      (Math.pow(1 + taxaNum, prazoNum) - 1)
      : valorNum / prazoNum;

  const bancosOrdenados = [...banks].sort(

    (a, b) => (a.interest ?? 999) - (b.interest ?? 999)
  );
  const bancoSelecionado =
    prazoNum <= 6
      ? bancosOrdenados[0]
      : prazoNum <= 12
        ? bancosOrdenados[1]
        : bancosOrdenados[2];





  return (



    <DashboardLayout>
      <div className="min-h-screen bg-hsl">
        {/* LOGO */}
        <div className="flex items-center gap-3 p-5">

        </div>

        {/* TÍTULO */}
        <h2 className="text-center text-xl font-semibold text-foreground mb-2">
          Melhores ofertas de empréstimo
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10 px-4">
          Escolha uma das opções abaixo com condições já aprovadas <br />
          ou simule um valor personalizado para você.
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
                onClick={() => handleSolicitarBanco(banco)}
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
               Simulação personalizada
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Taxa automática baseada no prazo selecionado
            </p>
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg mb-3 text-center">
  <p className="text-xs text-primary">Banco selecionado</p>
  <p className="text-sm font-semibold text-foreground">
    {bancoSelecionado?.name || "Banco parceiro"}
  </p>
</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Valor desejado
                </label>
                <input
                  type="text"
                  value={new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(valor) / 100)}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, "").slice(0, 15);
                    setValor(numbers);
                  }}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Prazo
                </label>
                <select
                  value={prazo}
                  onChange={(e) => {
                    const novoPrazo = parseInt(e.target.value);

                    setPrazo(e.target.value);

                    if (novoPrazo === 6) setTaxa("2.5");
                    else if (novoPrazo === 12) setTaxa("2.8");
                    else setTaxa("3.1");
                  }}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                  <option value="18">18 meses</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Taxa (automatica)
                </label>
                <select
                  value={taxa}

                  className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="2.5">2%</option>
                  <option value="2.8">2.5%</option>
                  <option value="3.1">3%</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">

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

              <div className="flex items-center gap-3">
                <p className="text-sm text-green-600 font-medium">
                  ✔ Pré-aprovado
                </p>
              </div>

              <button
                disabled={loadingBtn}
                onClick={async () => {
                  if (!user) return;

                  setLoadingBtn(true);

                  const { error } = await supabase.from("simulations").insert([
                    {
                      user_id: user.id,
                      user_name: userName || (
                        user.email?.split("@")[0]?.charAt(0).toUpperCase() +
                        user.email?.split("@")[0]?.slice(1)
                      ),
                      valor: valorNum,
                      prazo: prazoNum,
                      parcela: parcela,
                      status: "Em análise",
                      bank_name: bancoSelecionado?.name,
                    },
                  ]);

                  if (error) {
                    setLoadingBtn(false);
                    toast({
                      title: "Erro ao salvar",
                      description: error.message,
                    });
                    return;
                  }

                  // Notifica o usuário na plataforma sobre o recebimento da solicitação
                  await supabase.from("notifications").insert([
                    {
                      user_id: user.id,
                      type: "simulacao",
                      message: `A sua solicitação de empréstimo no valor de ${new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(valorNum)} foi enviada com sucesso e passará por análise. Em breve você receberá atualizações.`,
                      viewed: false,
                      archived: false,
                    },
                  ]);

                  await buscarHistorico();

                  // tempo mínimo de loading (1 segundo)
                  await new Promise((resolve) => setTimeout(resolve, 1000));

                  setValor("0");
                  setLoadingBtn(false);

                  toast({
                    title: "Solicitação enviada!",
                    description: "Sua simulação foi registrada e está em análise.",
                  });
                }}

                className="bg-primary text-white border-none py-2.5 px-6 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 hover:brightness-95 active:scale-95 active:brightness-90"
              >
                {loadingBtn ? "Enviando..." : "Confirmar Solicitação"}
              </button>

            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ao confirmar, sua solicitação será enviada para análise do banco.
            </p>

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
            Você ainda não fez nenhuma solicitação.
          </p>
        ) : (
          historico.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-zinc-50 p-4 rounded-xl shadow-md mb-3 border border-zinc-200"
            >
              <p className="text-card-foreground text-sm">
                <strong>Nome:</strong> {userName || item.user_name}
              </p>

              <p className="text-card-foreground text-sm">
                <strong>Valor:</strong>{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.valor)}
              </p>

              <p className="text-card-foreground text-sm">
                <strong>Prazo:</strong> {item.prazo} meses
              </p>

              <p className="text-card-foreground text-sm">
                <strong>Status:</strong> {item.status}
              </p>
              {item.valor > 0 && item.bank_name && (
                <p className="text-card-foreground text-sm">
                  <strong>Banco:</strong> {item.bank_name}
                </p>
              )}

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
