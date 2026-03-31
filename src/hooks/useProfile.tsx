import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Profile {
  id?: string;
  user_id: string;
  name?: string;
  age?: string;
  cpf?: string;
  birth?: string;
  phone?: string;
  state?: string;
  city?: string;
  photo_url?: string;
  points?: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProfile(user.id);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...updates, user_id: user.id }, { onConflict: "user_id" });

    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }

    // Reload profile after update
    await loadProfile(user.id);
    return true;
  };

  return { profile, loading, updateProfile };
};