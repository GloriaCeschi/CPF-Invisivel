import { Lightbulb, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function ScoreTipsCard() {
  const { user } = useAuth();
  const [tipsStatus, setTipsStatus] = useState({
    renda: false,
    luz: false,
    curso: false,
    internet: false,
    pix: false,
  });

  useEffect(() => {
    if (!user) return;

    const fetchStatus = async () => {
      // Busca todas as provas/comprovantes do usuário
      const { data: proofs } = await supabase
        .from("proofs")
        .select("type, title")
        .eq("user_id", user.id);

      // Conta o progresso concluído nos cursos
      const { count: coursesCount } = await supabase
        .from("courses_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("completed_at", "is", null);

      let renda = false, luz = false, internet = false, pix = false, cursoProof = false;

      if (proofs) {
        renda = proofs.some(
          (p) =>
            p.title &&
            (p.title.toLowerCase().includes("renda") ||
             p.title.toLowerCase().includes("comprovante") ||
             p.title.toLowerCase().includes("holerite") ||
             p.title.toLowerCase().includes("salário") ||
             p.title.toLowerCase().includes("salario"))
        );

        pix = proofs.some(
          (p) => p.title && p.title.toLowerCase().includes("pix")
        );

        luz = proofs.some(
          (p) =>
            p.title &&
            (p.title.toLowerCase().includes("luz") ||
              p.title.toLowerCase().includes("energia") ||
              p.title.toLowerCase().includes("cemig") ||
              p.title.toLowerCase().includes("enel") ||
              p.title.toLowerCase().includes("cpfl") ||
              p.title.toLowerCase().includes("neoenergia"))
        );

        internet = proofs.some(
          (p) =>
            p.title &&
            (p.title.toLowerCase().includes("internet") ||
              p.title.toLowerCase().includes("claro") ||
              p.title.toLowerCase().includes("vivo") ||
              p.title.toLowerCase().includes("tim") ||
              p.title.toLowerCase().includes("oi") ||
              p.title.toLowerCase().includes("wifi"))
        );

        cursoProof = proofs.some(
          (p) =>
            p.title &&
            (p.title.toLowerCase().includes("curso") ||
              p.title.toLowerCase().includes("gestão") ||
              p.title.toLowerCase().includes("gestao") ||
              p.title.toLowerCase().includes("financeira"))
        );
      }

      setTipsStatus({
        renda: renda || proofs?.some((p) => p.type === "income" && !p.title?.toLowerCase().includes("pix")),
        luz,
        curso: (coursesCount !== null && coursesCount > 0) || cursoProof,
        internet,
        pix,
      });
    };

    fetchStatus();
  }, [user]);

  const tips = [
    { text: "Enviar comprovante de renda", done: tipsStatus.renda },
    { text: "Pagar conta de luz em dia", done: tipsStatus.luz },
    { text: "Completar curso de Gestão Financeira", done: tipsStatus.curso },
    { text: "Cadastrar conta de internet", done: tipsStatus.internet },
    { text: "Enviar extrato PIX dos últimos 3 meses", done: tipsStatus.pix },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-5 w-5 text-support" />
          Como melhorar seu score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-3">
            {tip.done ? (
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <span className={`text-sm ${tip.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {tip.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
