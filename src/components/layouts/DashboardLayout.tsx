import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MessageCircle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import supabase from "@/utils/supabase";
import { useLocation } from "react-router-dom";
import { NotificationsPopover } from "@/components/NotificationsPopover";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type Mensagem = {
  texto: string;
  autor: "bot" | "user";
};

export function DashboardLayout({ children }: DashboardLayoutProps) {

  const { user } = useAuth();
  const [prof, setProf] = useState<{ name?: string }>({});
  const location = useLocation();

  const [chatOpen, setChatOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      texto: "Olá! 👋 Seja bem-vindo ao Renda Visível 💰",
      autor: "bot"
    },
   {
  texto: "Como posso te ajudar?\n\n📊 Melhorar score\n📚 Ver cursos\n💰 Crédito\n🎮 Gamificação",
  autor: "bot"
}
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [chatOpen]);
  
  function normalizar(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  } function gerarResposta(msg: string): string[] {
  const texto = normalizar(msg);

  // 🎓 CURSOS ESPECÍFICOS
 if (
  (texto === "curso" || texto === "cursos") ||
  (texto.includes("curso") && texto.split(" ").length === 1)
) {
  return [
    "Você tem vários cursos disponíveis 📚",
    "Gestão financeira • Controle de renda • Organização de contas • Crédito consciente • Investimentos",
    "Quer saber mais sobre algum específico? 😊"
  ];
}
  if (texto.includes("gestao")) {
    return [
      "O curso de Gestão Financeira te ajuda a organizar seu dinheiro e tomar decisões melhores.",
      "Completar ele pode aumentar seu score.",
      "Quer começar? Vá na aba Cursos 📚"
    ];
  }

  if (texto.includes("renda")) {
    return [
      "Nesse curso você aprende a acompanhar sua renda e entender seus ganhos.",
      "Isso ajuda no controle financeiro e melhora seu score.",
      "Acesse na aba Cursos 📊"
    ];
  }

  if (texto.includes("conta") || texto.includes("boleto")) {
    return [
      "Você aprende a organizar contas e manter tudo em dia.",
      "Pagar contas corretamente aumenta seu score.",
      "Veja esse curso na aba Cursos 💡"
    ];
  }

  if (texto.includes("emprest") || texto.includes("credito bancario")) {
    return [
      "Esse curso ensina como usar crédito com responsabilidade.",
      "Evitar dívidas melhora muito seu score.",
      "Você encontra na aba Cursos 💳"
    ];
  }

  if (texto.includes("juros") || texto.includes("invest")) {
    return [
      "Você vai aprender como o dinheiro cresce e como investir melhor.",
      "Isso ajuda na sua evolução financeira.",
      "Disponível na aba Cursos 📈"
    ];
  }
  

  // 📊 SCORE (MELHORADO)
  if (texto.includes("score")) {
    return [
      "Seu score mostra como está sua vida financeira.",
      "Você pode melhorar pagando contas, adicionando renda e fazendo cursos.",
      "Continue usando a plataforma para melhorar seu score 📈"
    ];
  }

  // 🎮 GAMIFICAÇÃO
  if (texto.includes("gamifica")) {
    return [
      "Você ganha pontos conforme usa o app.",
      "Cursos, contas pagas e renda aumentam seu progresso.",
      "Isso impacta diretamente seu score."
    ];
  }

  // 💰 CRÉDITO
  if (texto.includes("emprest") || texto.includes("credito")) {
    return [
      "Você possui ofertas de crédito disponíveis.",
      "Acesse a aba Crédito para simular e contratar.",
      "Quanto melhor seu score, melhores serão suas ofertas."
    ];
  }

  // 🚀 COMEÇAR
  if (texto.includes("comecar")) {
    return [
      "Ótima escolha.",
      "Comece pelos cursos ou adicionando sua renda.",
      "Isso já vai ajudar a melhorar seu score."
    ];
  }

  return [
    "Posso te ajudar com sua vida financeira 😊",
    "Quer ver cursos, melhorar seu score ou acessar crédito?"
  ];
}
async function enviarMensagem() {
  if (!input.trim()) return;

  const mensagemUser: Mensagem = {
    texto: input,
    autor: "user",
  };

  setMensagens((prev) => [...prev, mensagemUser]);
  setInput("");
  setTyping(true);

  await new Promise((r) => setTimeout(r, 300));

  const respostas = gerarResposta(mensagemUser.texto);

  setTyping(false);

  for (let i = 0; i < respostas.length; i++) {
    await new Promise((r) => setTimeout(r, 300));

    setMensagens((prev) => [
      ...prev,
      {
        texto: respostas[i],
        autor: "bot",
      },
    ]);
  }
  if (timeoutRef.current) {
  clearTimeout(timeoutRef.current);
}

timeoutRef.current = setTimeout(() => {
  setMensagens((prev) => [
    ...prev,
    {
      texto: "Posso te ajudar com algo? 😊",
      autor: "bot",
    },
  ]);
}, 60000);


}
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">

          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm">
                Olá, <strong>{prof?.name || "Usuário"}</strong> 👋
              </span>
            </div>

            <NotificationsPopover />
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center"
          >
            <MessageCircle className="text-white" />
          </button>

          {chatOpen && (
            <div className="fixed bottom-40 right-6 w-80 bg-white rounded-2xl shadow-lg border overflow-hidden">

              <div className="bg-primary p-4 flex justify-between">
                <span className="text-white text-sm font-semibold">
                  Renda Visível
                </span>
                <button onClick={() => setChatOpen(false)}>
                  <X className="text-white" />
                </button>
              </div>

              <div ref={chatRef} className="p-4 h-60 overflow-y-auto text-sm space-y-2">

                {mensagens.map((msg, index) => (
                  <div key={index} className={`flex ${msg.autor === "user" ? "justify-end" : "justify-start"}`}>

                    <div
                      className={`px-3 py-2 rounded-2xl max-w-[75%] ${msg.autor === "user"
                        ? "bg-white text-black border shadow-sm"
                        : "bg-pink-100 text-black"
                        }`}
                    >
                      {msg.texto}
                    </div>

                  </div>
                ))}

                {typing && (
                  <p className="text-gray-400 text-xs">digitando...</p>
                )}
              </div>

              <div className="flex border-t">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                  className="flex-1 p-2 outline-none text-black"
                  placeholder="Digite sua mensagem..."
                />
                <button onClick={enviarMensagem} className="bg-primary text-white px-4">
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