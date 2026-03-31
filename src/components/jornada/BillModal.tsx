import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import type { Proof } from "@/types/jornada";

interface BillModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingBill?: Proof | null;
}

export default function BillModal({ open, onClose, onSaved, editingBill }: BillModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [totalInstallments, setTotalInstallments] = useState("1");
  const [currentInstallment, setCurrentInstallment] = useState("1");
  const [nextDueDate, setNextDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingBill) {
      setTitle(editingBill.title);
      setDescription(editingBill.description || "");
      setAmount(String(editingBill.amount));
      setTotalInstallments(String(editingBill.total_installments));
      setCurrentInstallment(String(editingBill.current_installment));
      setNextDueDate(editingBill.next_due_date || "");
    } else {
      setTitle("");
      setDescription("");
      setAmount("");
      setTotalInstallments("1");
      setCurrentInstallment("1");
      setNextDueDate("");
      setFile(null);
    }
  }, [editingBill, open]);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/bills/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("receipts")
      .upload(path, file, { upsert: true, contentType: file.type });

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

    let receiptUrl = editingBill?.proof || null;
    if (file) {
      receiptUrl = await uploadFile(file);
    }

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      amount: parseFloat(amount),
      total_installments: parseInt(totalInstallments),
      current_installment: parseInt(currentInstallment),
      next_due_date: nextDueDate || null,
      type: "bill",
      status: editingBill?.status || "pendente",
      proof: receiptUrl,
      user_id: user.id,
      update_at: new Date().toISOString(),
    };

    let error;
    if (editingBill) {
      ({ error } = await supabase.from("proofs").update(data).eq("id", editingBill.id));
    } else {
      ({ error } = await supabase.from("proofs").insert(data));
    }

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingBill ? "Conta atualizada!" : "Conta adicionada!" });
      onSaved();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[hsl(218,26%,29%)]">
            {editingBill ? "Editar Conta" : "Adicionar Conta Paga"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-[hsl(218,26%,29%)]">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input placeholder="Ex: Conta de luz" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea placeholder="Detalhes da conta..." value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" min="0.01" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Próximo vencimento</Label>
              <Input type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Parcela atual</Label>
              <Input type="number" min="1" value={currentInstallment} onChange={(e) => setCurrentInstallment(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Total de parcelas</Label>
              <Input type="number" min="1" value={totalInstallments} onChange={(e) => setTotalInstallments(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Comprovante (PDF ou imagem)</Label>
            <label className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{file ? file.name : "Selecionar arquivo"}</span>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">Data de pagamento registrada automaticamente pelo sistema.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
