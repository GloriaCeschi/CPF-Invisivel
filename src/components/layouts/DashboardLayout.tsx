import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, MessageCircle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type Mensagem = {
  texto: string;
  autor: "bot" | "user";
  hora?: string;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {

  const { user } = useAuth();
  const [prof, setProf] = useState<{ name?: string }>({});
  const navigate = useNavigate();

  // CHAT STATES
  const [chatOpen, setChatOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { texto: "Olá! 👋 Como posso ajudar você hoje?", autor: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [nome, setNome] = useState("");
  const [etapa, setEtapa] = useState("inicio");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setProf(data);
    }

    loadProfile();
  }, [user]);

  function getHoraAtual() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }

  function gerarResposta(msg: string) {
    const texto = msg.toLowerCase();

    if (etapa === "inicio") {
      setEtapa("nome");
      return "Qual seu nome?";
    }

    if (etapa === "nome") {
      const nomeFormatado =
        msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();

      setNome(nomeFormatado);
      setEtapa("menu");

      return `Prazer, ${nomeFormatado}! 😊 Como posso te ajudar?\n\nVocê pode perguntar sobre: Taxas\n- Prazos\n- Bancos\n- Empréstimos`;
    }

    if (texto.includes("taxa")) {
      return `${nome}, as taxas variam entre 2.5% e 3.1% ao mês.`;
    }

    if (texto.includes("prazo")) {
      return `${nome}, os prazos vão até 24 meses.`;
    }

    if (texto.includes("banco")) {
      return `${nome}, trabalhamos com Caixa, Inter e Nubank.`;
    }

    if (texto.includes("empréstimo") || texto.includes("simular")) {
      return `${nome}, me diga o valor e o prazo que você quer 😉`;
    }

    return `${nome}, não entendi muito bem 🤔 Pode explicar melhor?`;
  }

  async function enviarMensagem() {
    if (!input.trim()) return;

    const mensagemAtual = input;

    const mensagemUser: Mensagem = {
      texto: mensagemAtual,
      autor: "user",
      hora: getHoraAtual(),
    };

    setMensagens((prev) => [...prev, mensagemUser]);
    setInput("");
    setTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const resposta = gerarResposta(mensagemAtual);

    const mensagemBot: Mensagem = {
      texto: resposta,
      autor: "bot",
      hora: getHoraAtual(),
    };

    setTyping(false);
    setMensagens((prev) => [...prev, mensagemBot]);
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER */}
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Olá, <strong className="text-foreground">{prof?.name || "Usuário"}</strong> 👋
              </span>
            </div>

            <button
              onClick={() => navigate("/notifications")}
              className="relative text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </header>

          {/* CONTEÚDO */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* BOTÃO CHAT */}
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* CHAT */}
          {chatOpen && (
            <div className="fixed bottom-40 right-6 z-50 w-80 bg-white rounded-2xl shadow-lg border overflow-hidden">

              {/* HEADER CHAT */}
              <div className="bg-primary p-4 flex justify-between items-center">
                <span className="text-white font-semibold text-sm">
                  Renda Visível Assistente
                </span>

                <button onClick={() => setChatOpen(false)}>
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* MENSAGENS */}
              <div className="p-4 h-60 overflow-y-auto text-black text-sm">
                {mensagens.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <p
                      className={`inline-block px-3 py-2 rounded-lg ${msg.autor === "user"
                          ? "bg-white text-black border border-gray-200"
                          : "bg-pink-50 text-black"
                        }`}
                    >
                      {msg.texto}
                    </p>

                    <span className="text-[10px] text-gray-400">
                      {msg.hora}
                    </span>
                  </div>
                ))}

                {typing && (
                  <p className="text-left text-gray-400 text-sm">
                    digitando...
                  </p>
                )}
              </div>

              {/* INPUT */}
              <div className="flex border-t">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 p-2 text-sm outline-none text-black bg-white"
                />

                <button
                  onClick={() => enviarMensagem()}
                  className="bg-primary text-white px-4"
                >
                  Enviar
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
