// ==========================================
// 1. IMPORTS
// ==========================================
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MoreHorizontal, Menu, ArrowLeft } from "lucide-react";

// ==========================================
// 2. TIPAGENS (TYPES)
// ==========================================
type NotificationItem = {
    id: string;
    user_id?: string;
    message?: string;
    viewed?: boolean;
    created_at: string;
    archived?: boolean;
};

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
export default function Notifications() {
    // --- CONTEXTOS ---
    const { user } = useAuth();

    // --- ESTADOS (STATES) ---
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [archivedCount, setArchivedCount] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'recent' | 'archived'>('recent');
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

    // --- EFEITOS COLATERAIS (USE EFFECT) ---
    // Executa sempre que o usuário logar ou trocar entre recentes/arquivados
    useEffect(() => {
        if (user) {
            fetchData(user.id);
        }
    }, [user, viewMode]);

    // ==========================================
    // 4. FUNÇÕES DE BANCO DE DADOS (API)
    // ==========================================
    async function fetchData(user_id: string) {
        const isArchived = viewMode === 'archived';

        // 4.1 Busca a lista de notificações
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq("user_id", user_id)
            .eq("archived", isArchived)
            .order('created_at', { ascending: false });

        if (data) setNotifications(data);

        // 4.2 Busca a quantidade total de arquivadas (para o botão inferior)
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq("user_id", user_id)
            .eq("archived", true);

        if (count !== null) setArchivedCount(count);
    }

    // ==========================================
    // 5. FUNÇÕES DE AÇÃO (HANDLERS)
    // ==========================================
    
    // --- ARQUIVAR ---
    async function handleArchive(id: string) {
        await supabase.from('notifications').update({ archived: true }).eq('id', id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        setArchivedCount(prev => prev + 1);
        setOpenMenuIndex(null); // Fecha o menu após a ação
    }

    // --- DESARQUIVAR ---
    async function handleUnarchive(id: string) {
        await supabase.from('notifications').update({ archived: false }).eq('id', id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        setArchivedCount(prev => Math.max(0, prev - 1));
        setOpenMenuIndex(null); // Fecha o menu após a ação
    }

    // --- MARCAR COMO LIDA ---
    async function handleMarkAsRead(index: number) {
        const item = notifications[index];
        
        // Bloqueia a ação se já estiver lida ou se estiver na tela de arquivados
        if (item.viewed || viewMode === 'archived') return;
        
        await supabase.from('notifications').update({ viewed: true }).eq('id', item.id);
        
        // Atualiza o estado local para refletir a visualização instantaneamente
        const updated = [...notifications];
        updated[index].viewed = true;
        setNotifications(updated);
    }

    // ==========================================
    // 6. RENDERIZAÇÃO DA TELA (UI)
    // ==========================================
    return (
        <DashboardLayout>
            
            {/* Overlay invisível para fechar o menu ao clicar fora */}
            {openMenuIndex !== null && (
                <div onClick={() => setOpenMenuIndex(null)} className="fixed inset-0 z-40 pointer-events-auto" />
            )}

            <div className="flex justify-center w-full p-6">
                <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-md p-4 animate-fade-in">

                    {/* --- HEADER --- */}
                    <div className="flex items-center justify-between mb-4 min-h-[40px]">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm text-zinc-600 font-medium">
                                {viewMode === 'archived' ? 'Arquivados' : 'Notificações'}
                            </h2>
                        </div>

                        {/* Controles do Header (Contador de não lidas ou Botão Voltar) */}
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

                    {/* --- LISTA DE NOTIFICAÇÕES --- */}
                    <div className="space-y-3">      
                        {notifications.map((item, index) => {
                            const initials = item.message?.slice(0, 2).toUpperCase() || "NA";
                            const isMenuOpen = openMenuIndex === index;
                            
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => !item.viewed && handleMarkAsRead(index)}
                                    // A MÁGICA DO Z-INDEX ESTÁ AQUI NA ÚLTIMA CLASSE DO INTERPOLADOR
                                    className={`cursor-pointer flex items-center justify-between p-6 border-b border-zinc-200 last:border-none transition-all duration-200 hover:bg-zinc-100 ${
                                        item.viewed ? "opacity-60" : ""
                                    } ${isMenuOpen ? "relative z-50" : "relative z-10"}`}
                                >
                                    {/* Esquerda: Avatar e Texto */}
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

                                    {/* Direita: Botão de Opções (Três pontinhos) */}
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuIndex(isMenuOpen ? null : index);
                                            }}
                                            className="hover:bg-zinc-200 p-2 rounded-md transition relative z-10"
                                        >
                                            <MoreHorizontal className="w-5 h-5 text-black" />
                                        </button>

                                        {/* Dropdown Menu (Arquivar/Desarquivar) */}
                                        {isMenuOpen && (
                                            <div className="absolute right-0 mt-2 min-w-[140px] bg-white border border-black/20 rounded-lg shadow-xl z-50">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                    {/* --- BOTÃO INFERIOR (Acessar Arquivadas) --- */}
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
    );
}