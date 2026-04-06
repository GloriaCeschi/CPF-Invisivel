import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  TrendingUp,
  Gamepad2,
  CreditCard,
  Bell,
  GraduationCap,
  Route,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { ShieldCheck } from "lucide-react";

const menuItems = [
  { title: "Início", url: "/home", icon: Home },
  { title: "Jornada Financeira", url: "/score", icon: Route },
  { title: "Gamificação", url: "/gamificacao", icon: Gamepad2 },
  { title: "Crédito", url: "/credit", icon: CreditCard },
  { title: "Cursos", url: "/cursos", icon: GraduationCap },
  { title: "Perfil", url: "/profile", icon: User },
];

const adminItems = [
  { title: "Painel Admin", url: "/admin/proofs", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const {user, signOutUser} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    navigate("/auth");
  };

  const [prof, setProf] = useState<{ name?: string; roles?: string; photo_url?: string }>({});

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("name, roles, photo_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setProf(data);
    }
    loadProfile();
  }, [user]);

  function getInitials(name?: string) {
  if (!name) return "US"; // fallback para "Usuário"
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">RV</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-base text-sidebar-foreground">Renda Visível</h2>
              <p className="text-xs text-muted-foreground">Seu score alternativo</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {prof?.roles === "admin" && adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            {prof?.photo_url && <AvatarImage src={prof.photo_url} alt={prof?.name || "Usuário"} />}
            <AvatarFallback className="bg-primary text-secondary-foreground font-semibold text-sm">
              {getInitials(prof?.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{prof?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "email não disponível"} </p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Deseja sair da conta?")) {
                    handleLogout();
                  }
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
