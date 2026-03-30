import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";

type Proof = {
  id: string;
  user_id: string;
  type: "income" | "bill";
  description: string | null;
  proof: string;
  status: "pendente" | "aprovado" | "rejeitado";
  feedback: string | null;
  points: number | null;
  created_at: string;
  update_at: string | null;
  user_name?: string;
  user_email?: string;
};

export default function AdminProofs() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
  const [feedback, setFeedback] = useState("");
  const [points, setPoints] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>("pendente");

  useEffect(() => {
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (isAdmin) loadProofs();
  }, [isAdmin, filter]);

  async function checkAdmin() {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("roles")
      .eq("user_id", user.id)
      .maybeSingle();

    setIsAdmin(data?.roles === "admin");
  }

  async function loadProofs() {
    setLoading(true);

    let query = supabase
      .from("proofs")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "todos") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Erro ao carregar documentos",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const userIds = [...new Set((data || []).map((p) => p.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, email")
      .in("user_id", userIds);

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

    const enriched = (data || []).map((p) => ({
      ...p,
      user_name: profileMap.get(p.user_id)?.name || "Sem nome",
      user_email: profileMap.get(p.user_id)?.email || "",
    }));

    setProofs(enriched);
    setLoading(false);
  }

  async function handleAction(status: "aprovado" | "rejeitado") {
    if (!selectedProof) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("proofs")
      .update({
        status,
        feedback,
        points: status === "aprovado" ? parseInt(points) || 0 : 0,
        update_at: new Date().toISOString(),
      })
      .eq("id", selectedProof.id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (status === "aprovado") {
        if (selectedProof.type === "income") {
          await supabase.rpc("add_income_points", { income_id: selectedProof.id });
        } else if (selectedProof.type === "bill") {
          await supabase.rpc("add_bill_points", { bill_id: selectedProof.id });
        }
      }

      toast({ title: `Documento ${status} com sucesso!` });
      setSelectedProof(null);
      setFeedback("");
      setPoints("");
      loadProofs();
    }
    setActionLoading(false);
  }

  function getStatusBadge(status: string | null) {
    switch (status) {
      case "aprovado":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "rejeitado":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  }

  if (authLoading || isAdmin === null) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return (
  <DashboardLayout>
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os documentos enviados pelos usuários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {proofs.length} documento(s)
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: "pendente", label: "Pendentes" },
          { value: "aprovado", label: "Aprovados" },
          { value: "rejeitado", label: "Rejeitados" },
          { value: "todos", label: "Todos" },
        ].map((f) => (
          <Button
            className="bg-primary"
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos para Análise</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : proofs.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Nenhum documento encontrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proofs.map((proof) => (
                  <TableRow key={proof.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {proof.user_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {proof.user_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{proof.type || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {proof.description || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(proof.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{getStatusBadge(proof.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProof(proof);
                            setFeedback(proof.feedback || "");
                            setPoints(String(proof.points || ""));
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>

    {/* Detail Dialog */}
    <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Documento</DialogTitle>
        </DialogHeader>

        {selectedProof && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Usuário</p>
                <p className="font-medium">{selectedProof.user_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">{selectedProof.type || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data de envio</p>
                <p className="font-medium">
                  {new Date(selectedProof.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                {getStatusBadge(selectedProof.status)}
              </div>
            </div>

            {selectedProof.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {selectedProof.description}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Documento</p>
              <a
                href={selectedProof.proof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline hover:text-primary/80"
              >
                Visualizar documento ↗
              </a>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Feedback</p>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escreva um feedback para o usuário..."
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Pontos</p>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background text-foreground border-input"
                placeholder="Pontos a conceder"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={() => handleAction("aprovado")}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-1" />
                )}
                Aprovar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleAction("rejeitado")}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                Rejeitar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </DashboardLayout>
);
}