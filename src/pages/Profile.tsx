import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

type Profile = {
    nome?: string,
    idade?: string,
    cpf?: string,
    dataNascimento?: string,
    telefone?: string,
    estado?: string,
    cidade?: string,
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const {user, signOutUser} = useAuth();
  const [prof, setProf] = useState<Profile>({});

  async function handleProfile(){
    const data = {...prof, user_id: user.id};

    const {error} = await supabase.from('profiles').insert(data);

    if(error){
      alert(error.message);
      return;
    }

    alert("Cadastrado com sucesso")
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

 


  return (
    


    <div className="min-h-screen rgb(255, 240, 242)">
      <ProfileHeader/>
      
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
                    <img src={photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {prof.nome ? prof.nome[0].toUpperCase() : "?"}
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
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  value={prof.nome}
                  onChange={(e) => setProf({...prof, nome: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Ex: 25"
                  value={prof.idade}
                  onChange={(e) => setProf({...prof, idade: e.target.value})}
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
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={prof.dataNascimento}
                  onChange={(e) => setProf({...prof, dataNascimento: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={prof.telefone}
                  onChange={(e) => setProf({...prof, telefone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={prof.estado}
                  onValueChange={(v) => setProf({...prof, estado: v})}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="estado">
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
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Sua cidade"
                  value={prof.cidade}
                  onChange={(e) => setProf({...prof, cidade: e.target.value})}
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
  );
};

export default Profile;


