import { useEffect, useState } from "react"
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MoreHorizontal } from "lucide-react";

type notifications = {
    user_id?: string
    key_id?: string
    message?: string
    viewed?: boolean
    created_at: string
    id?: string
    archived?: boolean
};
export default function Notifications() {

    async function handleArchive(index: number) {
        console.log("arquivd")
        const item = notifications[index];

        const { error } = await supabase
            .from('notifications')
            .update({ archived: true })
            .eq('id', item.id);

        if (error) {
            console.log(error.message);
            return;
        }

        const updated = notifications.filter((_, i) => i !== index);

        setNotifications(updated);
        setOpenMenuIndex(null);
    }

    async function handleMarkAsRead(index: number) {
        const item = notifications[index];

        if (item.viewed) return;

        const updated = [...notifications];
        updated[index].viewed = true;

        const { error } = await supabase
            .from('notifications')
            .update({ viewed: true }) // boolean, não string!
            .eq('id', item.id); // 🔥 aqui está a chave

        if (error) {
            console.log(error.message);
            return;
        }

        setNotifications(updated);
    }
    async function handleDelete(index: number) {
        const item = notifications[index];

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', item.id);

        if (error) {
            console.log(error.message);
            return;
        }

        const updated = notifications.filter((_, i) => i !== index);

        setNotifications(updated);
        setOpenMenuIndex(null);
    }






    const { user, signOutUser } = useAuth();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

    const [notifications, setNotifications] = useState<notifications[]>([]);



    useEffect(() => {
        if (user) loadNotifications(user.id);
    }, []);

    async function loadNotifications(user_id: string): Promise<void> {
        console.log(user_id)
        const { data, error } = await supabase.from('notifications')
            .select('*')
            .eq("user_id", user_id)
            .eq("archived", false)
            .order('created_at', { ascending: false });
        console.log(data)
        if (error) {
            alert(error.message)
            return
        }

        setNotifications(data);



    }



    return (
        <>


            <DashboardLayout>
                {openMenuIndex !== null && (
                   <div
    onClick={() => setOpenMenuIndex(null)}
    className="fixed inset-0 z-40 pointer-events-auto"
/>
                )}
                <div className="flex justify-center w-full p-6">
                    <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-md p-4 animate-fade-in">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm text-zinc-600 font-medium">Notificações</h2>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                                {notifications.filter(n => !n.viewed).length} não lidas
                            </span>
                        </div>

                        {/* Lista */}
                        <div className="space-y-3">
                            {notifications.length === 0 && (
                                <p className="text-center text-zinc-400 text-sm">
                                    Nenhuma notificação
                                </p>
                            )}

                            {notifications.map((item, index) => {
                                const initials = item.message?.slice(0, 2).toUpperCase() || "NA";

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleMarkAsRead(index)}
                                        className={`cursor-pointer flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.01] active:scale-[0.98] ${item.viewed ? "opacity-60" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">

                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                                    {initials}
                                                </div>

                                                {!item.viewed && (
                                                    <>
                                                        <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                                                        <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Texto */}
                                            <div>

                                                <p className="text-xs text-zinc-500">
                                                    {item.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botão */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuIndex(openMenuIndex == index ? null : index);
                                                }}
                                                className="hover:bg-zinc-100 p-1 rounded-md transition"
                                            >
                                                <MoreHorizontal className="w-5 h-5 text-black" />
                                            </button>

                                            {openMenuIndex == index && (
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("arv");
                                                    }} 
                                                    className="absolute right-0 mt-2 min-w-[140px] bg-white border border-black/20 rounded-lg shadow-lg z-50"
                                                >

                                                    <button
                                                        
                                                        className="w-full text-left px-3 py-2 text-sm text-black font-semibold flex items-center gap-2 hover:bg-zinc-100"
                                                    >
                                                        📥 Arquivar
                                                    </button>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                </div>
            </DashboardLayout>

        </>
    )

}
