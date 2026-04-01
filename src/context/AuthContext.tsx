import { createContext, useContext, useEffect, useState } from "react";
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);

      // Enviar notificação de boas-vindas no primeiro login
      if (event === 'SIGNED_IN' && session?.user) {
        await sendWelcomeNotification(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function sendWelcomeNotification(userId: string) {
    try {
      // Verificar se já existe uma notificação de boas-vindas para este usuário
      const { data: existingNotification } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'welcome')
        .limit(1);

      // Se não existe, criar a notificação de boas-vindas
      if (!existingNotification || existingNotification.length === 0) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            message: '🎉 Bem-vindo ao Renda Visível! Comece sua jornada financeira explorando os cursos disponíveis e registrando suas rendas e contas.',
            type: 'welcome',
            viewed: false,
            archived: false,
          });

        if (error) {
          console.error('Erro ao enviar notificação de boas-vindas:', error);
        } else {
          console.log('✅ Notificação de boas-vindas enviada para o usuário:', userId);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar/enviar notificação de boas-vindas:', error);
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