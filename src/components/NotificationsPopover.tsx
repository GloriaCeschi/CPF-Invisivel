import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { MoreHorizontal, Menu, ArrowLeft, Bell, CheckCheck, Undo2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type NotificationItem = {
    id: string;
    user_id?: string;
    message?: string;
    viewed?: boolean;
    created_at: string;
    archived?: boolean;
};

export function NotificationsPopover() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [archivedCount, setArchivedCount] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'recent' | 'archived'>('recent');
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [recentReadIds, setRecentReadIds] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            fetchData(user.id);
        }
    }, [user, viewMode]);

    async function fetchData(user_id: string) {
        const isArchived = viewMode === 'archived';

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq("user_id", user_id)
            .eq("archived", isArchived)
            .order('created_at', { ascending: false });

        if (data) setNotifications(data);

        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq("user_id", user_id)
            .eq("archived", true);

        if (count !== null) setArchivedCount(count);
    }

    async function handleArchive(id: string) {
        await supabase.from('notifications').update({ archived: true }).eq('id', id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        setArchivedCount(prev => prev + 1);
        setOpenMenuIndex(null);
    }

    async function handleUnarchive(id: string) {
        await supabase.from('notifications').update({ archived: false }).eq('id', id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        setArchivedCount(prev => Math.max(0, prev - 1));
        setOpenMenuIndex(null);
    }

    async function handleMarkAsRead(index: number) {
        const item = notifications[index];
        if (item.viewed || viewMode === 'archived') return;
        
        await supabase.from('notifications').update({ viewed: true }).eq('id', item.id);
        
        const updated = [...notifications];
        updated[index].viewed = true;
        setNotifications(updated);
    }

    async function handleMarkAllAsRead() {
        const unreadIds = notifications.filter(n => !n.viewed).map(n => n.id);
        if (unreadIds.length === 0) return;

        await supabase.from('notifications').update({ viewed: true }).in('id', unreadIds);
        
        setNotifications(prev => prev.map(n => ({ ...n, viewed: true })));
        setGlobalUnread(0);
        setRecentReadIds(unreadIds);
    }

    async function handleUndoMarkAllAsRead() {
        if (recentReadIds.length === 0) return;

        await supabase.from('notifications').update({ viewed: false }).in('id', recentReadIds);
        
        setNotifications(prev => prev.map(n => recentReadIds.includes(n.id) ? { ...n, viewed: false } : n));
        setGlobalUnread(prev => prev + recentReadIds.length);
        setRecentReadIds([]);
    }

    const unreadCount = viewMode === 'recent' 
        ? notifications.filter(n => !n.viewed).length 
        : 0; // Se estiver em arquivos, os não lidos aparecem lá, mas vamos garantir o display pro sino

    // Buscar qtd unread global caso precise estar no modal arquivado
    const [globalUnread, setGlobalUnread] = useState(0);
    useEffect(() => {
        if (!user) return;
        async function getUnread() {
             const { count } = await supabase.from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user!.id)
                .eq('viewed', false)
                .or('archived.is.null,archived.eq.false');
             if (count !== null) setGlobalUnread(count);
        }
        getUnread();
    }, [notifications, user]);


    return (
        <Popover onOpenChange={(open) => { 
            if (!open) {
                setOpenMenuIndex(null); 
                // Limpa o estado de "Desfazer" sempre que o modal é fechado para não confundir usos futuros
                setRecentReadIds([]);
            }
        }}>
            <PopoverTrigger asChild>
                <button className="relative text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {globalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                            {globalUnread}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-[400px] p-4 rounded-xl shadow-xl border-zinc-200 bg-white">
                {openMenuIndex !== null && (
                    <div onClick={() => setOpenMenuIndex(null)} className="fixed inset-0 z-40 pointer-events-auto" />
                )}

                {/* HEADER */}
                <div className="flex items-center justify-between mb-4 min-h-[40px]">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm text-zinc-600 font-medium tracking-tight">
                            {viewMode === 'archived' ? 'Arquivados' : 'Notificações'}
                        </h2>
                    </div>

                    <div>
                        {viewMode === 'recent' ? (
                            <div className="flex items-center gap-2">
                                {recentReadIds.length > 0 && (
                                    <button 
                                        onClick={handleUndoMarkAllAsRead}
                                        className="text-xs font-semibold text-primary hover:text-primary transition-colors flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg"
                                        title="Desfazer marcar lidas"
                                    >
                                        <Undo2 className="w-3.5 h-3.5" />
                                        Desfazer
                                    </button>
                                )}
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg"
                                        title="Marcar todas como lidas"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Lidas
                                    </button>
                                )}
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-sidebar-accent text-primary px-2 py-1 rounded-full font-semibold">
                                        {unreadCount} não lidas
                                    </span>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setViewMode('recent')}
                                className="flex items-center gap-2 text-xs font-semibold text-primary bg-sidebar-accent hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all border border-blue-100"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Voltar
                            </button>
                        )}
                    </div>
                </div>

                {/* LISTA */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">      
                    {notifications.length === 0 ? (
                        <p className="text-sm text-center text-zinc-500 py-6">Nenhuma notificação encontrada.</p>
                    ) : (
                        notifications.map((item, index) => {
                            const initials = item.message?.slice(0, 2).toUpperCase() || "NA";
                            const isMenuOpen = openMenuIndex === index;
                            
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => !item.viewed && handleMarkAsRead(index)}
                                    className={`cursor-pointer flex items-center justify-between p-3 border-b border-zinc-100 last:border-none transition-all duration-200 hover:bg-zinc-50 rounded-lg ${
                                        item.viewed ? "opacity-60" : ""
                                    } ${isMenuOpen ? "relative z-50 bg-zinc-50" : "relative z-10"}`}
                                >
                                    {/* Esquerda */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                                {initials}
                                            </div>
                                            {!item.viewed && viewMode === 'recent' && (
                                                <>
                                                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                                                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
                                                </>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-[13px] text-zinc-600 leading-snug">{item.message}</p>
                                        </div>
                                    </div>

                                    {/* Direita */}
                                    <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuIndex(isMenuOpen ? null : index);
                                            }}
                                            className="hover:bg-zinc-200 p-1.5 rounded-md transition relative z-10"
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-black" />
                                        </button>

                                        {isMenuOpen && (
                                            <div className="absolute right-0 mt-2 min-w-[140px] bg-white border border-black/10 rounded-lg shadow-xl z-50">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        viewMode === 'recent' ? handleArchive(item.id) : handleUnarchive(item.id);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-[13px] text-black font-semibold flex items-center gap-2 hover:bg-zinc-100 rounded-lg"
                                                >
                                                    {viewMode === 'recent' ? '📁 Arquivar' : '↩ Desarquivar'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* BOTÃO INFERIOR */}
                {viewMode === 'recent' && archivedCount > 0 && (
                    <div
                        onClick={() => setViewMode('archived')}
                        className="mt-4 flex items-center justify-between p-3 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 border border-zinc-100 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Menu className="w-4 h-4 text-primary" />
                            <span className="text-[13px] font-medium text-zinc-700">Arquivadas</span>
                        </div>
                        <span className="text-[11px] bg-sidebar-accent text-primary px-2 py-0.5 rounded-full font-bold">
                            {archivedCount}
                        </span>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
