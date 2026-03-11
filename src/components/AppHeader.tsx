import { useState } from "react";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

const mockNotifications = [
  { id: 1, text: "Você completou 50% do curso de Gestão Financeira!", time: "2h atrás" },
  { id: 2, text: "Novo curso disponível: Direitos do Consumidor", time: "1d atrás" },
  { id: 3, text: "Seu score aumentou 15 pontos! 🎉", time: "3d atrás" },
];

export function AppHeader() {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

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
              3
            </Badge>
          </Button>
          {showNotifications && (
            <div className="absolute right-0 top-10 w-72 rounded-lg border border-border bg-card p-3 shadow-lg animate-scale-in z-50">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Notificações</p>
              {mockNotifications.map((n) => (
                <div key={n.id} className="mb-2 rounded-md bg-muted p-2 text-xs last:mb-0">
                  <p className="text-foreground">{n.text}</p>
                  <p className="mt-1 text-muted-foreground">{n.time}</p>
                </div>
              ))}
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
