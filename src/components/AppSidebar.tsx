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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { title: "Início", url: "/home", icon: Home },
  { title: "Meu Score", url: "/score", icon: TrendingUp },
  { title: "Gamificação", url: "/gamificacao", icon: Gamepad2 },
  { title: "Crédito", url: "/credito", icon: CreditCard },
  { title: "Notificações", url: "/notificacoes", icon: Bell },
  { title: "Cursos", url: "/cursos", icon: GraduationCap },
  { title: "Jornada Financeira", url: "/jornada", icon: Route },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-sm">
              CA
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">Caroline</p>
                <p className="text-xs text-muted-foreground truncate">caroline@email.com</p>
              </div>
              <button className="text-muted-foreground hover:text-destructive transition-colors" title="Sair">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
