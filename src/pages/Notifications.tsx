import { useEffect, useState } from "react"
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

type notifications = {
    user_id?: string
    key_id?: string
    message?: string
    viewed?: boolean
    created_at: string
};
export default function Notifications() {
    const { user, signOutUser } = useAuth();

    const [notifications, setNotifications] = useState<notifications[]>([
  {
    "user_id": "user_01",
    "key_id": "1",
    "message": "Sua conta foi atualizada com sucesso",
    "viewed": false,
    "created_at": "2026-03-18T10:30:00"
  },
  {
    "user_id": "user_02",
    "key_id": "2",
    "message": "Você recebeu uma nova mensagem",
    "viewed": false,
    "created_at": "2026-03-18T09:15:00"
  },
  {
    "user_id": "user_03",
    "key_id": "3",
    "message": "Pagamento confirmado",
    "viewed": true,
    "created_at": "2026-03-17T18:40:00"
  },
  {
    "user_id": "user_04",
    "key_id": "4",
    "message": "Novo acesso detectado",
    "viewed": false,
    "created_at": "2026-03-17T14:20:00"
  },
  {
    "user_id": "user_05",
    "key_id": "5",
    "message": "Atualização disponível no sistema",
    "viewed": true,
    "created_at": "2026-03-16T11:00:00"
  }
]);

    useEffect(() => {
       // if (user) loadNotifications(user.id);
    }, [user]);

    async function loadNotifications(user_id: string): Promise<void> {
        const { data, error } = await supabase.from('notifications')
            .select('*').eq("user_id", user_id)
            .order('created_at', { ascending: false });

        if (error) {
            alert(error.message)
            return
        }

        setNotifications(data);
    }



    return (
        <>


            <DashboardLayout>
                <div className="flex justify-center w-full p-6">
                    <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-md p-4 animate-fade-in">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm text-zinc-600 font-medium">Arquivados</h2>
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
                                        className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.01]"
                                    >
                                        <div className="flex items-center gap-3">

                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                                    {initials}
                                                </div>

                                                {!item.viewed && (
                                                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                                                )}
                                            </div>

                                            {/* Texto */}
                                            <div>
                                                <p className="text-sm text-zinc-800 font-semibold">
                                                    {item.user_id}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {item.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botão */}
                                        <button className="text-zinc-400 hover:text-zinc-700 transition">
                                            •••
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-center mt-4 gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="w-2 h-2 bg-zinc-300 rounded-full"></span>
                            <span className="w-2 h-2 bg-zinc-300 rounded-full"></span>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

        </>
    )

}
