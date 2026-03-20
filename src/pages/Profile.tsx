import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "@/components/ProfileHeader";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

type Profile = {
    id?: string,
    name?: string,
    age?: string,
    cpf?: string,
    birth?: string,
    phone?: string,
    state?: string,
    city?: string,
    photo_url?: string,
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const {user, signOutUser} = useAuth();
  const [prof, setProf] = useState<Profile>({});

  useEffect (() => {
    syncProfile(user.id);

  }, []);

  async function syncProfile(user_id: string ):Promise<void>{
    const {data, error} = await supabase.from('profiles').select('*').eq("user_id", user_id).maybeSingle();
    // order('created_at', {ascending: false})

    if(error){
      alert(error.message)
      return
    }

    if (data){
       setProf(data);
    }

  }

 

  async function handleProfile(){
    const data = {...prof, user_id: user.id};

    console.log(data)

    const {error} = await supabase.from('profiles').upsert(data, {onConflict: "user_id"});

    if(error){
      alert(error.message);
      return;
    }

    alert("Perfil atualizado com sucesso")
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Nome único para o arquivo
      const fileName = `${user.id}-${Date.now()}.${file.name.split(".").pop()}`;
      // Upload para Supabase Storage
      const {error} = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

      if (error) {
        toast.error("Erro ao enviar foto:"+ error.message);
        return;
      }
      // Obter URL pública
      const {data} = supabase.storage.from("avatars").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      // Atualizar estado local
      setPhotoUrl(publicUrl);

      //Salvar no perfil
      const {error: updateError} = await supabase
      .from("profiles")
      .update({photo_url: publicUrl})
      .eq("user_id", user.id);

      if (updateError){
        toast.error("Erro ao salvar foto no perfil:" + updateError.message);
        return;
      }

      toast.success("Foto de perfil atualizada!");
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao enviar foto.");
    }
  };

 


  return (
    

    <DashboardLayout>
    <div className="min-h-screen rgb(255, 240, 242)">
      
      
    <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Meu Perfil</h2>
          <p className="text-muted-foreground mt-1">Visualize e atualize suas informações.</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardContent className="pt-8 pb-6 px-6">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full rgb(255, 240, 242) border-4 border-primary/20 overflow-hidden flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl || prof.photo_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {prof.name ? prof.name[0].toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Camera size={16} className="text-primary-foreground" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={prof.name}
                  onChange={(e) => setProf({...prof, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 25"
                  value={prof.age}
                  onChange={(e) => setProf({...prof, age: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={prof.cpf}
                  onChange={(e) => setProf({...prof, cpf: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="birth">Data de Nascimento</Label>
                <Input
                  id="birth"
                  type="date"
                  value={prof.birth}
                  onChange={(e) => setProf({...prof, birth: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={prof.phone}
                  onChange={(e) => setProf({...prof, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Select
                  value={prof.state}
                  onValueChange={(v) => setProf({...prof, state: v})}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((uf) => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Sua cidade"
                  value={prof.city}
                  onChange={(e) => setProf({...prof, city: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8 justify-end">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleProfile}>
                    Salvar Alterações
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </DashboardLayout>
  );
};

export default Profile;


