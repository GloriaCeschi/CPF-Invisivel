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
import type { Income } from "@/types/jornada";
import { Console } from "console";

interface IncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingIncome?: Income | null;
}

const RECEIPT_TYPES = [
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
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
      setReceiptType(editingIncome.receipt_type);
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
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("receipts").upload(path, file);
    console.log("aqui")
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("receipts").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log (user)
    if (!user) return;
    setLoading(true);
      
    try {
      let receiptUrl = editingIncome?.receipt_url || null;
      if (file) {
        
        receiptUrl = await uploadFile(file);
      }

      const parsedAmount = parseFloat(amount.replace(",", "."));

      const data = {
        title: title.trim(),
        description: description.trim() || null,
        amount: parsedAmount,
        receipt_type: receiptType,
        receipt_url: receiptUrl,
        user_id: user.id,
      };

      let error;
      if (editingIncome) {
        ({ error } = await supabase.from("incomes").update(data).eq("id", editingIncome.id));
      } else {
        ({ error } = await supabase.from("incomes").insert(data));
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

          <div className="space-y-2">
            <Label className="text-[hsl(218,26%,29%)]">Título</Label>
            <Input
              className="bg-muted text-[hsl(218,26%,29%)] placeholder:text-[hsl(218,26%,29%)] border-border focus:ring-2 focus:ring-primary"
              placeholder="Ex: Venda de frutas na feira"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(218,26%,29%)]">Descrição</Label>
            <Textarea
              className="bg-muted text-[hsl(218,26%,29%)] placeholder:text-[hsl(218,26%,29%)] border-border focus:ring-2 focus:ring-primary"
              placeholder="Detalhes da renda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label className="text-[hsl(218,26%,29%)]">Valor (R$)</Label>
              <Input
                className="bg-muted text-[hsl(218,26%,29%)] border-border focus:ring-2 focus:ring-primary"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[hsl(218,26%,29%)]">Tipo de Comprovante</Label>
              <Select value={receiptType} onValueChange={setReceiptType}>
                <SelectTrigger className="bg-muted text-[hsl(218,26%,29%)] border-border focus:ring-2 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-[hsl(218,26%,29%)]">
                  {RECEIPT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(218,26%,29%)]">Comprovante (PDF ou imagem)</Label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm cursor-pointer hover:bg-muted/80 transition-colors text-[hsl(218,26%,29%)]">
                <Upload className="h-4 w-4 flex-shrink-0 text-[hsl(218,26%,29%)]" />
                <span className="text-[hsl(218,26%,29%)] ">
                  {file ? file.name : "Selecionar arquivo"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <p className="text-xs text-[hsl(218,26%,29%)]">
            Data e horário registrados automaticamente pelo sistema.
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="text-[hsl(218,26%,29%)]">
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
