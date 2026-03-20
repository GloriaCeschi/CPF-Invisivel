import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Mensagem = {
  texto: string;
  autor: "bot" | "user";
};

export default function ChatBot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { texto: "Olá! 👋 Qual seu nome?", autor: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [nome, setNome] = useState("");
  const [etapa, setEtapa] = useState("inicio");

  function gerarResposta(msg: string) {
    const texto = msg.toLowerCase();

    // pedir nome
    if (etapa === "inicio") {
      setEtapa("nome");
      return "Qual seu nome?";
    }

    // salvar nome
    if (etapa === "nome") {
      const nomeFormatado =
        msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();

      setNome(nomeFormatado);
      setEtapa("menu");

      return `Prazer, ${nomeFormatado}! 😊 Como posso te ajudar?\n\nVocê pode perguntar sobre:\n- Taxas\n- Prazos\n- Bancos\n- Empréstimos`;
    }

    // respostas
    if (texto.includes("taxa")) {
      return `${nome}, as taxas são:\n- Caixa: 2.5%\n- Inter: 3.1%\n- Nubank: 2.8%`;
    }

    if (texto.includes("prazo")) {
      return `${nome}, os prazos vão até 24 meses.`;
    }

    if (texto.includes("banco")) {
      return `${nome}, trabalhamos com Caixa, Inter e Nubank.`;
    }

    if (texto.includes("como funciona")) {
      return `${nome}, o empréstimo funciona por análise de crédito.`;
    }

    if (texto.includes("empréstimo")) {
      return `${nome}, me diga o valor e prazo 😉`;
    }

    return `${nome}, não entendi 🤔`;
  }

  function enviarMensagem() {
    if (!input.trim()) return;

    const novaMensagem = { texto: input, autor: "user" as const };
    setMensagens((prev) => [...prev, novaMensagem]);

    const resposta = gerarResposta(input);

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        { texto: resposta, autor: "bot" }
      ]);
    }, 500);

    setInput("");
  }

  return (
    <>
      {/* botão flutuante */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center"
      >
        <MessageCircle className="text-white" />
      </button>

      {/* chat */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-lg border">
          <div className="bg-primary p-3 flex justify-between text-white">
            <span>Assistente</span>
            <button onClick={() => setChatOpen(false)}>
              <X />
            </button>
          </div>

          <div className="p-3 h-60 overflow-y-auto">
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded ${
                  msg.autor === "user"
                    ? "bg-primary text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.texto}
              </div>
            ))}
          </div>

          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 outline-none"
              placeholder="Digite..."
            />
            <button onClick={enviarMensagem} className="px-4">
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}