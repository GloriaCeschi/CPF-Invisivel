import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import supabase from "../utils/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const welcomeCheckedRef = useRef(false);

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!error) {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }

      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && !welcomeCheckedRef.current) {
      welcomeCheckedRef.current = true;
      sendWelcomeNotification(user.id);
    }
  }, [user]);

  async function sendWelcomeNotification(userId: string) {
    try {
      // Verificar se já existe uma notificação de boas-vindas para este usuário
      const { data: existingNotification, error: selectError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'welcome')
        .limit(1);

      if (selectError) {
        if (selectError.message?.includes('AbortError')) return;
        return;
      }

      // Se não existe, criar a notificação de boas-vindas
      if (!existingNotification || existingNotification.length === 0) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            message: '👋 Bem-vindo(a) ao Renda Visível! Para começar sua jornada com clareza financeira, por favor, complete seu cadastro. Assim, você libera o acesso total a todos os benefícios e conteúdos disponíveis em nossa plataforma. Tenha uma excelente experiência!',
            type: 'welcome',
            viewed: false,
            archived: false,
          });

        if (error) {
          if (error.message?.includes('AbortError')) return;
        } else {
         // console.log('✅ Notificação de boas-vindas enviada com sucesso!');
        }
      }
    } catch (error: any) {
      if (error.message?.includes('AbortError')) return;
    }
  }

  async function signOutUser() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}