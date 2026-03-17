import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {

  const { user } = useAuth();
  const [prof, setProf] = useState<{ name?: string }>({});
  const navigate = useNavigate();

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
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Olá, <strong className="text-foreground">{prof?.name || "Usuário"}</strong> 👋</span>
            </div>
            <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
