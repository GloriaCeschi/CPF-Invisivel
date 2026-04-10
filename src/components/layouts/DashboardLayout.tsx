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
  texto: "Olá! 👋 Sou o assistente do Renda Visível. Estou aqui pra te ajudar a melhorar seu score financeiro!\n\nSobre o que quer saber?\n\n📚 Cursos\n💳 Crédito\n📊 Jornada Financeira\n🎮 Gamificação",
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
  }
  

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function generateReply(
  userMessage: string,
  history: any[] = []
): string {
  const input = normalize(userMessage);

  // 📚 CURSOS (AGORA COMPLETO)
  if (input.includes("curso")) {
    return `Você tem cursos disponíveis 📚

1. Gestão Financeira  
2. Acompanhamento de Renda  
3. Organização de Contas e Boletos  
4. Uso Consciente de Crédito  
5. Planejamento Familiar  
6. Como Adicionar Contas e Boletos  
7. Empreendedorismo  
8. Valor da Sua Hora  
9. Valor da Sua Mão de Obra  
10. Cálculos de Juros  
11. Direitos do Consumidor  
12. Como Entender o Mercado  

Qual deles te interessa? 😊`;
  }

 // 🎓 CURSO POR NÚMERO (1 a 12)
const COURSES = [
  "Gestão Financeira",
  "Acompanhamento de Renda",
  "Organização de Contas e Boletos",
  "Uso Consciente de Crédito",
  "Planejamento Familiar",
  "Como Adicionar Contas e Boletos",
  "Empreendedorismo",
  "Valor da Sua Hora",
  "Valor da Sua Mão de Obra",
  "Cálculos de Juros",
  "Direitos do Consumidor",
  "Como Entender o Mercado",
];

const COURSE_DETAILS: Record<string, string[]> = {
  "gestao financeira": [
    "Você aprende a organizar melhor seu dinheiro e controlar seus gastos. Isso ajuda diretamente a melhorar seu score 📈.\n\nAcesse na aba Cursos pra começar!",
    "Nesse curso você descobre como criar metas financeiras realistas e manter o controle do que gasta. Gestão organizada = score subindo 📈.\n\nTá na aba Cursos, vai lá!",
  ],
  "acompanhamento de renda": [
    "Você aprende a registrar e acompanhar tudo que entra no seu bolso. Com a renda organizada, seu score melhora naturalmente 💰.\n\nVá até a aba Cursos pra conferir!",
    "Aqui você descobre como ter controle total sobre o que ganha. Renda atualizada é essencial pro score subir 💰.\n\nConfira na aba Cursos!",
  ],
  "organizacao de contas e boletos": [
    "Você aprende a nunca mais perder um vencimento. Contas pagas em dia são um dos maiores fatores pra subir o score ✅.\n\nConfira na aba Cursos!",
    "Esse curso te ensina a organizar todas as suas contas num só lugar. Pagar em dia faz o score disparar ✅.\n\nTá disponível na aba Cursos!",
  ],
  "uso consciente de credito": [
    "Você aprende a usar crédito a seu favor, sem se enrolar. Usar crédito com responsabilidade melhora muito seu score 💳.\n\nAcesse na aba Cursos pra saber mais!",
    "Aqui você descobre como o crédito pode ser seu aliado. Saber usar com consciência é chave pra um score forte 💳.\n\nVeja na aba Cursos!",
  ],
  "planejamento familiar": [
    "Você aprende a planejar as finanças da família toda. Quando a casa tá organizada financeiramente, o score de todos melhora 👨‍👩‍👧‍👦.\n\nVeja na aba Cursos!",
    "Nesse curso você descobre como organizar o orçamento familiar de forma prática. Família organizada = score em alta 👨‍👩‍👧‍👦.\n\nConfira na aba Cursos!",
  ],
  "como adicionar contas e boletos": [
    "Você aprende o passo a passo pra cadastrar suas contas e boletos no app. Manter tudo registrado ajuda a pagar em dia e subir o score 📋.\n\nAcesse na aba Cursos pra aprender!",
    "Aqui te mostramos como cadastrar cada conta no app rapidinho. Quanto mais organizado, melhor o score 📋.\n\nVá até a aba Cursos!",
  ],
  "empreendedorismo": [
    "Você aprende como empreender de forma inteligente e organizada. Ter uma renda extra bem gerenciada contribui pro seu score 🚀.\n\nConfira na aba Cursos!",
    "Esse curso te ajuda a transformar uma ideia em renda extra. Empreender com organização faz seu score crescer 🚀.\n\nTá na aba Cursos, aproveita!",
  ],
  "valor da sua hora": [
    "Você aprende a calcular quanto vale sua hora de trabalho. Saber isso ajuda a organizar sua renda, o que reflete no score ⏰.\n\nVeja na aba Cursos!",
    "Descubra quanto seu tempo vale de verdade! Isso muda a forma como você organiza sua renda e impacta direto no score ⏰.\n\nAcesse na aba Cursos!",
  ],
  "valor da sua mao de obra": [
    "Você descobre como precificar seu trabalho de forma justa. Valorizar sua mão de obra melhora sua renda e seu score 🔧.\n\nAcesse na aba Cursos!",
    "Aprenda a cobrar o valor certo pelo seu trabalho. Uma renda justa fortalece seu score 🔧.\n\nConfira na aba Cursos!",
  ],
  "calculos de juros": [
    "Você aprende como funcionam os juros e evita armadilhas financeiras. Saber calcular juros protege seu score 🧮.\n\nConfira na aba Cursos!",
    "Entenda os juros antes que eles te peguem! Esse curso te dá ferramentas pra proteger seu bolso e seu score 🧮.\n\nVeja na aba Cursos!",
  ],
  "direitos do consumidor": [
    "Você conhece seus direitos na hora de comprar e contratar serviços. Consumir com consciência protege seu bolso e seu score ⚖️.\n\nVeja na aba Cursos!",
    "Sabia que conhecer seus direitos te ajuda a economizar? Esse curso protege seu bolso e fortalece seu score ⚖️.\n\nTá na aba Cursos!",
  ],
  "como entender o mercado": [
    "Você aprende a interpretar o mercado financeiro de forma simples. Entender o cenário econômico te ajuda a planejar melhor e fortalecer seu score 📊.\n\nAcesse na aba Cursos!",
    "Entenda como o mercado funciona de forma descomplicada. Planejar com base no cenário real faz seu score subir 📊.\n\nConfira na aba Cursos!",
  ],
};
const numberMatch = input.match(/^(\d{1,2})$/);
if (numberMatch) {
  const num = parseInt(numberMatch[1]);
  if (num >= 1 && num <= 12) {
    const course = COURSES[num - 1];
    const key = normalize(course);
    const details = COURSE_DETAILS[key];
    if (details) {
    return details[Math.floor(Math.random() * details.length)] + "\n\nQuer ajuda com algo mais? 😊";
    }
  }
}
// 📊 JORNADA FINANCEIRA
if (input.includes("jornada")) {
  return `A Jornada Financeira é onde você acompanha seu:

📈 Score
💰 Renda
📋 Contas

Fico feliz que você tá buscando melhorar! 🙌 Manter tudo atualizado é o caminho mais rápido pra melhorar seu score! Acesse a aba Jornada pra conferir como você tá indo! 🚀

Precisa de mais alguma coisa?`;
}
  // 📊 SCORE
  if (input.includes("score")) {
    return "Seu score melhora com renda atualizada, contas pagas e cursos feitos 📈 Continue assim!";
  }

  // 💰 EMPRÉSTIMO
if (
  input.includes("emprest") ||
  input.includes("dinheiro") ||
  input.includes("simular") ||
  input.includes("credito")
) {
  return `Temos ofertas de crédito disponíveis pra você! 💳

Quanto melhor seu score, melhores são as condições. Acesse a aba Crédito pra conferir as opções e simular!

Tem mais alguma dúvida? Tô aqui! 😊`;
}

 
 // 🎮 GAMIFICAÇÃO
if (
  input.includes("gamifica") ||
  input.includes("pontos") ||
  input.includes("pontuacao")
) {
  return `No Renda Visível você ganha pontos ao usar o app! 🎮

Ações que dão pontos:
📚 Fazer cursos
💰 Adicionar renda
📋 Organizar contas

Quanto mais você usa, mais progride e melhor fica seu score! Continue assim! 🏆

Quer ajuda com algo mais? 😊`;
}


/// 🔎 ENTENDER QUALQUER PARTE DO NOME DO CURSO
for (const course of COURSES) {
  const courseNorm = normalize(course);

  // quebra o nome em palavras (gestao, financeira, etc)
  const words = courseNorm.split(" ");

  for (const word of words) {
    // pega pelo menos 3 letras da palavra
    if (word.length >= 3 && input.includes(word.slice(0, 3))) {
      const details = COURSE_DETAILS[courseNorm];
      if (details) {
        return details[Math.floor(Math.random() * details.length)] + "\n\nQuer ajuda com algo mais? 😊";
      }
    }
  }
}
 return `Posso te ajudar com várias coisas! Escolha uma opção:

📚 Cursos — educação financeira
💳 Crédito — ofertas e simulação
📊 Jornada Financeira — acompanhar seu progresso
🎮 Gamificação — ganhar pontos

Digite uma dessas opções ou me conte o que precisa! 😊

💡 Dica: agora que já viu os cursos, acompanhe seu progresso na Jornada Financeira!`;
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

  const respostas = [generateReply(mensagemUser.texto)];

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




}
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">

          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-customBlue">
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
                      className={`px-3 py-2 rounded-2xl max-w-[75%] whitespace-pre-line  ${msg.autor === "user"
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