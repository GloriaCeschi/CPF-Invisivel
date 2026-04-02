import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const [user, setUser] = useState<User>({ name: "", email: "", pass: "" });
  const [confirmPass, setConfirmPass] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [pToast, sertPtoast] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de erro
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Função para validar senha
  function validatePassword(pass: string) {
    return {
      length: pass.length >= 6,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    };
  }

  const passwordChecks = validatePassword(user.pass || "");

  // Função para validar email
  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function showToast(msg: string) {
    sertPtoast(msg);
    setTimeout(() => {
      sertPtoast("");
    }, 5000);
  }

  async function checkedLogin(e: React.FormEvent) {
    e.preventDefault();

    if (tentativa >= 3) {
      showToast("Volte mais tarde");
      return;
    }
    setTentativa((prev) => prev + 1);

    if (!user?.email || !user?.pass) {
      showToast("Email e senha são obrigatórios");
      return;
    }

    // Limpa erros de validação de senha no login
    setPasswordError("");

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
    e.preventDefault();

    if (!user?.email || !user?.pass) {
      showToast("Email e Senha Obrigatórios!");
      return;
    }

    if (!validateEmail(user.email)) {
      showToast("Formato de e-mail inválido.");
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      showToast("A senha não atende aos requisitos.");
      return;
    }

    /*if (user.pass !== confirmPass) {
      showToast("As senhas não coincidem.");
      return;
    }*/

    setUsers([...users, user]);
    const { error } = await supabase.auth.signUp({
      email: user.email,
      password: user.pass,
    });

    if (error) {
      showToast(error.message);
      return;
    }

    showToast("Cadastrado com Sucesso!");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          {login ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription>
                Entre na sua conta para acessar sua jornada financeira
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Criar sua conta
              </CardTitle>
              <CardDescription>
                Comece sua jornada para a inclusão financeira
              </CardDescription>
            </>
          )}
        </CardHeader>

        <form onSubmit={login ? checkedLogin : handleRegister}>
          <CardContent className="space-y-4">
            {!login && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="nome completo"
                  value={user?.name || ""}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={user?.email || ""}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
                onBlur={() =>
                  setEmailError(
                    validateEmail(user.email || "")
                      ? ""
                      : "Formato de e-mail inválido."
                  )
                }
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={user?.pass || ""}
                  onChange={(e) =>
                    setUser({ ...user, pass: e.target.value })
                  }
                  onBlur={() => {
                    if (!login) {
                      // Só valida requisitos de senha no cadastro
                      setPasswordError(
                        Object.values(passwordChecks).every(Boolean)
                          ? ""
                          : "A senha não atende aos requisitos."
                      );
                    } else {
                      // No login, só valida se não está vazia
                      setPasswordError(
                        user.pass ? "" : "Senha é obrigatória"
                      );
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              {!login && (
                <ul className="mt-2 text-sm space-y-1">
                  <li
                    className={
                      passwordChecks.length ? "text-green-600" : "text-red-500"
                    }
                  >
                    • Mínimo de 6 caracteres
                  </li>
                  <li
                    className={
                      passwordChecks.upper ? "text-green-600" : "text-red-500"
                    }
                  >
                    • Pelo menos 1 letra maiúscula
                  </li>
                  <li
                    className={
                      passwordChecks.lower ? "text-green-600" : "text-red-500"
                    }
                  >
                    • Pelo menos 1 letra minúscula
                  </li>
                  <li
                    className={
                      passwordChecks.special ? "text-green-600" : "text-red-500"
                    }
                  >
                    • Pelo menos 1 caractere especial
                  </li>
                </ul>
              )}
            </div>

            {!login && (
              <div className="space-y-2">
                <Label htmlFor="confirmPass">Confirmar Senha</Label>
                <Input
                  id="confirmPass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  onBlur={() =>
                    setConfirmError(
                      user.pass === confirmPass
                        ? ""
                        : "As senhas não coincidem."
                    )
                  }
                  required
                />
                {confirmError && (
                  <p className="text-red-500 text-sm">{confirmError}</p>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full">
              {login ? "Entrar" : "Cadastrar"}
            </Button>
            <p className="text-sm text-muted-foreground">
              {login ? (
                <>
                  Não tem conta?{" "}
                  <a
                    onClick={() => setLogin(false)}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Cadastre-se
                  </a>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <a
                    onClick={() => setLogin(true)}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Entrar
                  </a>
                </>
              )}
            </p>
          </CardFooter>
        </form>

        {pToast && (
          <div className="mt-4 text-center text-red-500">{pToast}</div>
        )}
      </Card>
    </div>
  );
}
