import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import type { Proof } from "@/types/jornada";

interface IncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingIncome?: Proof | null;
}

const RECEIPT_TYPES = [
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão Débito" },
  { value: "deposito", label: "Depósito" },
];

export default function IncomeModal({ open, onClose, onSaved, editingIncome }: IncomeModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptType, setReceiptType] = useState("pix");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingIncome) {
      setTitle(editingIncome.title);
      setDescription(editingIncome.description || "");
      setAmount(String(editingIncome.amount));
      setReceiptType(editingIncome.receipt_type || "pix");
    } else {
      setTitle("");
      setDescription("");
      setAmount("");
      setReceiptType("pix");
      setFile(null);
    }
  }, [editingIncome, open]);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/incomes/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("receipts").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("receipts").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let proofUrl = editingIncome?.proof || null;
      if (file) {
        proofUrl = await uploadFile(file);
      }

      const parsedAmount = parseFloat(amount.replace(",", "."));

      const data: Partial<Proof> = {
        title: title.trim(),
        description: description.trim() || null,
        amount: parsedAmount,
        receipt_type: receiptType,
        proof: proofUrl,
        user_id: user.id,
        type: "income",
        status: editingIncome?.status || "pendente",
        created_at: editingIncome?.created_at || new Date().toISOString(),
      };

      let error;
      if (editingIncome) {
        ({ error } = await supabase.from("proofs").update(data).eq("id", editingIncome.id));
      } else {
        ({ error } = await supabase.from("proofs").insert(data));
      }

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: editingIncome ? "Renda atualizada!" : "Renda adicionada!" });
        onSaved();
        onClose();
      }
    } catch (err) {
      toast({ title: "Erro", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[hsl(218,26%,29%)]">
            {editingIncome ? "Editar Renda" : "Adicionar Renda"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos de formulário iguais */}
          {/* ... */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
