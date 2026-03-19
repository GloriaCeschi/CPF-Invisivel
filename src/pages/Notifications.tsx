import { useEffect, useState } from "react"
import supabase from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

type notifications = {
    user_id?:string
    key_id?:string
    message?:string
    viewed?:string
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
            <div className="">

            </div>
            </DashboardLayout>
        
    </>
)

}
