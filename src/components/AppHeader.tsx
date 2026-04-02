import { useState, useEffect } from "react";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

type HeaderNotification = {
  id: string;
  message: string;
  viewed: boolean;
  created_at: string;
};

export function AppHeader() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id,message,viewed,created_at")
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) setNotifications(data as HeaderNotification[]);
    };

    fetch();
  }, [user]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const unread = notifications.filter((n) => !n.viewed).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-lg font-bold text-primary">Renda Visível</span>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</a>
        <a href="/educacao" className="text-sm font-medium text-primary border-b-2 border-primary pb-0.5">Educação</a>
        <a href="/score" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Score</a>
      </nav>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" className="h-8 w-8 relative" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {unread}
            </Badge>
          </Button>
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 rounded-lg border border-border bg-card p-3 shadow-lg animate-scale-in z-50">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Notificações</p>
              {notifications.length === 0 ? (
                <div className="p-2 text-xs text-zinc-500">Nenhuma notificação recente</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="mb-2 rounded-md bg-muted p-2 text-xs last:mb-0">
                    <p className="text-foreground">{n.message}</p>
                    <p className="mt-1 text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">MV</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Maria V.</span>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
