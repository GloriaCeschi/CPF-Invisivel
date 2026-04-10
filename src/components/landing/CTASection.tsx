import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Sparkles } from "lucide-react";
import supabase from "../../utils/supabase";
import { User } from "@/pages/Auth";
import { Label } from "@/components/ui/label";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<User>({ email: "", pass: "" });
  const [users, setUsers] = useState<User[]>([]);



  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); // evita reload da página

    if (user?.email && user?.pass) {
      setUsers([...users, user]);
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.pass,
      });

      if (error) {
        const msg = error.message.toLowerCase();

        if (msg.includes("rate")) {
          showToast("Você já solicitou confirmação recentemente. Verifique sua caixa de entrada ou aguarde alguns minutos.");
        } else if (msg.includes("already registered") || msg.includes("already exists")) {
          showToast("Este e-mail já está cadastrado. Verifique sua caixa de entrada para confirmar ou tente recuperar a senha.");
        } else if (msg.includes("password")) {
          showToast("A senha precisa atender aos requisitos mínimos (ex: 6 caracteres).");
        } else {
          showToast(error.message);
        }
        return;
      }

      setSubmitted(true);
      showToast("Cadastro realizado! Verifique seu e-mail para confirmar.");
    } else {
      showToast("Email e Senha obrigatórios!");
    }
  }

  const [pToast, setPtoast] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function showToast(msg: string) {
    setPtoast(msg);
    setTimeout(() => setPtoast(""), 5000);
  }

  return (
    <section id="cta" className="py-20 md:py-28 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left - visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-primary rounded-3xl p-12 relative overflow-hidden h-full">
              <div className="relative z-10">
                <Sparkles className="w-12 h-12 text-primary-foreground/80 mb-6" />
                <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
                  Passe a existir financeiramente hoje
                </h3>
                <p className="text-primary-foreground text-lg mb-6">
                  Cadastre-se gratuitamente e comece a construir seu score alternativo agora mesmo.
                </p>
                <div className="flex flex-col gap-3 ">
                  {["Sem taxas de cadastro", "100% online e seguro", "Resultado em semanas"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-primary-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border h-full relative">

              {pToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-md shadow-lg">
                  {pToast}
                </div>
              )}

              {!submitted ? (
                <>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    Comece agora
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Vagas limitadas para acesso antecipado — crie sua senha hoje.
                  </p>
                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="space-y-2 text-customBlue">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="nome completo"
                        value={user?.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 text-customBlue">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={user?.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 text-customBlue">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={user?.pass || ""}
                        onChange={(e) => setUser({ ...user, pass: e.target.value })}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="bg-primary text-primary-foreground text-md w-full rounded-xl h-12 mt-2"
                    >
                      Garantir meu acesso agora
                    </Button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Cadastro recebido! 🎉</h3>
                  <p className="text-muted-foreground">
                    Um e-mail de confirmação foi enviado para <strong>{user.email}</strong>.
                    Acesse sua caixa de entrada e confirme para ativar sua conta.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>


    </section>
  );
};


export default CTASection;