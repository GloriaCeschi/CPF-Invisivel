import { useEffect, useState } from "react"
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MoreHorizontal, Menu, ArrowLeft } from "lucide-react";

type notifications = {
    user_id?: string
    message?: string
    viewed?: boolean
    created_at: string
    id: string
    archived?: boolean
};

export default function Notifications() {
    const { user } = useAuth();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [notifications, setNotifications] = useState<notifications[]>([]);
    const [archivedCount, setArchivedCount] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'recent' | 'archived'>('recent');

    useEffect(() => {
        if (user) fetchData(user.id);
    }, [user, viewMode]);

    async function fetchData(user_id: string) {
        const isArchived = viewMode === 'archived';
        const { data } = await supabase.from('notifications')
            .select('*').eq("user_id", user_id).eq("archived", isArchived)
            .order('created_at', { ascending: false });

        if (data) setNotifications(data);

        const { count } = await supabase.from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq("user_id", user_id).eq("archived", true);

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

    return (
        <DashboardLayout>
            {openMenuIndex !== null && (
                <div onClick={() => setOpenMenuIndex(null)} className="fixed inset-0 z-40 pointer-events-auto" />
            )}

            <div className="flex justify-center w-full p-6">
                <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-md p-4 animate-fade-in">

                    {/* Header - Alinhado com o badge na direita */}
                    <div className="flex items-center justify-between mb-4 min-h-[40px]">
                        <div className="flex items-center gap-2">
                            {viewMode === 'archived' ? (
                                <h2 className="text-sm text-zinc-600 font-medium">Arquivados</h2>
                            ) : (
                                <h2 className="text-sm text-zinc-600 font-medium">Notificações</h2>
                            )}
                        </div>

                        {/* Lado Direito do Header */}
                        <div>
                            {viewMode === 'recent' ? (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                                    {notifications.filter(n => !n.viewed).length} não lidas
                                </span>
                            ) : (
                                <button
                                    onClick={() => setViewMode('recent')}
                                    className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all border border-blue-100"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Voltar
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Lista - Design igual ao seu print */}
                    <div className="space-y-3">
                        {notifications.map((item, index) => {
                            const initials = item.message?.slice(0, 2).toUpperCase() || "NA";
                            return (
                                <div
                                    key={item.id}
                                    // MUDANÇA AQUI: Só dispara o clique se NÃO estiver visualizado
                                    onClick={() => !item.viewed && handleMarkAsRead(index)}
                                    className={`cursor-pointer flex items-center justify-between p-6 border-b border-zinc-200 last:border-none transition-all duration-200 hover:bg-zinc-100 ${item.viewed ? "opacity-60" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
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
                                            <p className="text-xs text-zinc-500">{item.message}</p>
                                        </div>
                                    </div>

                                    {/* Container do Botão de Opções */}
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita marcar como lida ao abrir o menu
                                                setOpenMenuIndex(openMenuIndex === index ? null : index);
                                            }}
                                            className="hover:bg-zinc-200 p-2 rounded-md transition relative z-10"
                                        >
                                            <MoreHorizontal className="w-5 h-5 text-black" />
                                        </button>

                                        {openMenuIndex === index && (
                                            <div className="absolute right-0 mt-2 min-w-[140px] bg-white border border-black/20 rounded-lg shadow-xl z-[100]">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // CRÍTICO: Evita que o card receba o clique
                                                        viewMode === 'recent' ? handleArchive(item.id) : handleUnarchive(item.id);
                                                    }}
                                                    className="w-full text-left px-3 py-3 text-sm text-black font-semibold flex items-center gap-2 hover:bg-zinc-100 rounded-lg"
                                                >
                                                    {viewMode === 'recent' ? '📁 Arquivar' : '↩ Desarquivar'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botão Arquivados Embaixo - Só aparece se tiver arquivadas */}
                    {viewMode === 'recent' && archivedCount > 0 && (
                        <div
                            onClick={() => setViewMode('archived')}
                            className="mt-4 flex items-center justify-between p-3 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 border border-zinc-100 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Menu className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium text-zinc-700">Arquivadas</span>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">
                                {archivedCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}