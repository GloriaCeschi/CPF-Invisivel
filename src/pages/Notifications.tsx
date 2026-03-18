import { useEffect, useState } from "react"
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

type notifications = {
    user_id?:string
    key_id?:string
    message?:string
};
export default function Notifications(){
    const {user, signOutUser} = useAuth();

    const [notifications, setNotifications] = useState<notifications[]>([]);

    useEffect(() => {
        if(user) loadNotifications(user.id);
    }, []);

    async function loadNotifications(user_id: string ): Promise<void>{
        const {data, error} = await supabase.from('notifications')
            .select('*').eq("user_id", user_id)
            .order('created_at', {ascending: false});

        if(error){
            alert(error.message)
            return
        }

        setNotifications(data);
    }


    
    return(
    <>
        
        
            <DashboardLayout>
            <div className="text-center p-8">
                <h1 className="text-4xl mb-5">Perfil</h1>

                <h2 className="text-3xl mb-4">Notificações</h2>

                <ul className="space-y-2">
                    <li className="text-xl">Mensagem da notificação</li>

                    <li className="text-xl">Outra mensagem</li>

                    <li className="text-xl">Mais uma notificação</li>
                </ul>

                <button className="text-xl mt-5 px-5 py-2 border border-black">
                    Sair
                </button>
            </div>
            </DashboardLayout>
        
    </>
)

}
