import { useEffect, useState } from "react";
import { Bell, TrendingUp, TrendingDown, Minus, FileCheck, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type Notice = {
  id: string;
  message: string;
  type: string;
  created_at: string;
};

export function NoticesCard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!error && data) {
          setNotices(data);
        }
      } catch (err) {
        console.error("Erro ao carregar notificações", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, [user]);

  function getVisuals(type: string, message: string) {
    const msgLower = message.toLowerCase();
    
    // Welcome message
    if (type === "welcome" || msgLower.includes("bem-vindo")) {
      return { icon: TrendingUp, color: "text-success", bg: "bg-success/10", title: "Bem-vindo!" };
    }
    // Aprovados
    if (msgLower.includes("aprovado") || msgLower.includes("validado")) {
      return { icon: FileCheck, color: "text-info", bg: "bg-info/10", title: "Comprovante aprovado" };
    }
    // Rejeitados
    if (msgLower.includes("rejeitado") || msgLower.includes("negado") || msgLower.includes("problema")) {
      return { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", title: "Atenção" };
    }
    // Recebido/Em análise
    if (msgLower.includes("recebido") || msgLower.includes("análise") || msgLower.includes("pendente") || type === "proof") {
      return { icon: AlertCircle, color: "text-support", bg: "bg-support/10", title: "Documento em análise" };
    }
    // Score updates
    if (type === "score_up" || msgLower.includes("subiu") || msgLower.includes("aumentou")) {
      return { icon: TrendingUp, color: "text-success", bg: "bg-success/10", title: "Score aumentou!" };
    }
    if (type === "score_stable" || msgLower.includes("manteve")) {
      return { icon: Minus, color: "text-muted-foreground", bg: "bg-muted", title: "Score mantido" };
    }
    // Default
    return { icon: Info, color: "text-muted-foreground", bg: "bg-muted", title: "Aviso" };
  }

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-5 w-5 text-support" />
          Avisos e Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
        ) : notices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Você não possui novos avisos.
          </p>
        ) : (
          notices.map((n) => {
            const visuals = getVisuals(n.type, n.message);
            const Icon = visuals.icon;
            
            let timeStr = "";
            try {
               timeStr = formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR });
            } catch(e) {
               timeStr = "Recentemente";
            }

            return (
              <div key={n.id} className="flex gap-3 items-start">
                <div className={`w-9 h-9 rounded-lg ${visuals.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${visuals.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{visuals.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-snug">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{timeStr}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}