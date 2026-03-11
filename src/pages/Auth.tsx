import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type User = {
  name?: string;
  email?: string;
  pass?: string;
};

export default function Auth() {
  const nav = useNavigate();
  const [tentativa, setTentativa] = useState(0);
  const [login, setLogin] = useState(true);

  const [user, setUser] = useState<User>({ email: "", pass: "" });
  const [users, setUsers] = useState<User[]>([]);

  async function checkedLogin(e: React.FormEvent) {
    e.preventDefault(); // evita reload da página

    if (tentativa < 3) {
      setTentativa(tentativa + 1);
    } else {
      showToast("Volte mais tarde");
      return;
    }

    setTentativa((prev) => prev + 1);

    if (!user?.email || !user?.pass) {
      showToast("Email e senha são obrigatórios");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.pass,
    });

    if (error) {
      showToast(error.message);
      return;
    }

    showToast("Login realizado");
    nav("/home", { replace: true });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); // evita reload da página

    if (user?.email && user?.pass) {
      setUsers([...users, user]);
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.pass,
      });

      if (error) {
        showToast(error.message);
        return;
      }

      showToast("Cadastrado com Sucesso!");
    } else {
      showToast("Email e Senha Obrigatorios!");
    }
  }

  const [pToast, sertPtoast] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function showToast(msg: string) {
    sertPtoast(msg);

    setTimeout(() => {
      sertPtoast("");
    }, 5000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          
           {login ? (<>
           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-7 w-7 text-primary" />
          </div>
            <CardTitle className="font-display text-2xl">Bem-vindo de volta</CardTitle>
          <CardDescription>Entre na sua conta para acessar sua jornada financeira</CardDescription>
           </>):(<>
           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-7 w-7 text-primary" />
          </div>
           <CardTitle className="font-display text-2xl">Criar sua conta</CardTitle>
          <CardDescription>Comece sua jornada para a inclusão financeira</CardDescription>
           </>)}
          
        </CardHeader>

        {/* Alterna entre login e cadastro */}
        <form onSubmit={login ? checkedLogin : handleRegister}>
          <CardContent className="space-y-4">

            {!login && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="name"
                placeholder="nome completo"
                value={user?.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>)
}

            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={user?.pass || ""}
                  onChange={(e) => setUser({ ...user, pass: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button onClick={login? checkedLogin:handleRegister} className="w-full">
              {login ? "Entrar" : "Cadastrar"}
            </Button>
            <p className="text-sm text-muted-foreground">
              {login ? (
                <>
                  Não tem conta?{" "}
                  <a onClick={() => setLogin(false)} className="text-primary font-semibold hover:underline">
                    Cadastre-se
                  </a>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <a onClick={() => setLogin(true)}  className="text-primary font-semibold hover:underline">
                    Entrar
                  </a>
                </>
              )}
            </p>
          </CardFooter>
        </form>

        {/* Toast de mensagens */}
        {pToast && <div className="mt-4 text-center text-red-500">{pToast}</div>}
      </Card>
    </div>
  );
}
