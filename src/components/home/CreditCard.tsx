import { useEffect, useState } from "react";
import { CreditCard as CreditCardIcon, ChevronRight, Lock, Loader2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

export function CreditAreaCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const [banksRes, simsRes] = await Promise.all([
        supabase.from('banks').select('*'),
        supabase.from('simulations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ]);

      const items = [];

      // Simulation item se existir
      if (simsRes.data && simsRes.data.length > 0) {
        const sim = simsRes.data[0];
        items.push({
          bank: "Sua Solicitação",
          limit: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(sim.valor),
          status: sim.status || "Em análise",
          available: false,
          isSimulation: true
        });
      }

      // Add top bancos
      if (banksRes.data) {
        const sortedBanks = banksRes.data.sort((a, b) => (a.interest || 99) - (b.interest || 99));
        
        for (const banco of sortedBanks) {
          if (items.length >= 3) break;
          
          const isBest = items.length === 0 || (items.length === 1 && items[0].isSimulation);
          
          items.push({
            bank: banco.name || "Banco Parceiro",
            limit: banco.max_amount ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(banco.max_amount) : "Sob consulta",
            status: isBest ? "Pré-aprovado" : `Taxa: ${banco.interest}% a.m.`,
            available: isBest,
            isSimulation: false
          });
        }
      }

      setOffers(items);
      setLoading(false);
    }
    
    fetchData();
  }, [user]);

  return (
    <Card 
      className="card-hover cursor-pointer transition-all hover:border-primary/50" 
      onClick={() => navigate("/credit")}
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 relative z-10">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCardIcon className="h-5 w-5 text-info" />
          Área de Crédito
        </CardTitle>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          offers.map((offer, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                offer.available ? "bg-card border-success/30" : "bg-muted/50 border-border"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{offer.bank}</p>
                <p className="text-xs text-muted-foreground">
                  {offer.isSimulation ? "Valor: " : "Limite: "}
                  {offer.limit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {offer.available || offer.isSimulation ? (
                  <Badge 
                    className={
                      offer.isSimulation 
                        ? "bg-orange-500 hover:bg-orange-600 text-white text-xs flex items-center gap-1"
                        : "bg-success text-success-foreground text-xs"
                    }
                  >
                    {offer.isSimulation && <Clock className="w-3 h-3 mr-1" />}
                    {offer.status}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    {offer.status}
                  </Badge>
                )}
                {offer.available && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
