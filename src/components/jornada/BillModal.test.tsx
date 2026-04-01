import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BillModal from "./BillModal";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Mocks
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  default: {
    storage: {
      from: vi.fn(),
    },
    from: vi.fn(),
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

// Mocks necessários pro Radix UI
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof window !== "undefined") {
  window.PointerEvent = class PointerEvent extends Event {} as any;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
}

describe("Documentos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve preencher os dados da conta paga, anexar comprovante, salvar e exibir mensagem de sucesso", async () => {
    const user = userEvent.setup();

    // Mock usuário autenticado
    const mockUser = { id: "user-123" };
    vi.mocked(useAuth).mockReturnValue({ user: mockUser } as any);

    // Mock storage
    const mockUpload = vi.fn().mockResolvedValue({ error: null });
    const mockGetPublicUrl = vi.fn().mockReturnValue({
      data: { publicUrl: "http://example.com/comprovante.pdf" },
    });

    // @ts-ignore
    supabase.storage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    });

    // Mock banco
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    // @ts-ignore
    supabase.from.mockReturnValue({
      insert: mockInsert,
    });

    const mockOnSaved = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <BillModal open={true} onClose={mockOnClose} onSaved={mockOnSaved} />
    );

    // Preencher inputs
    await user.type(
      screen.getByPlaceholderText("Ex: Conta de luz"),
      "Conta de Energia"
    );

    await user.type(
      screen.getByPlaceholderText("Detalhes da conta..."),
      "Referente a março"
    );

    await user.type(
      screen.getByPlaceholderText("0,00"),
      "150.50"
    );

    // Upload de arquivo (FORMA CORRETA)
    const file = new File(["dummy content"], "comprovante.pdf", {
      type: "application/pdf",
    });

    // 🔥 IMPORTANTE: ajuste aqui conforme seu componente
    // opção 1 (melhor): se tiver label
    // const fileInput = screen.getByLabelText(/comprovante/i);

    // opção 2: fallback seguro
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    expect(fileInput).toBeTruthy(); // garante que existe

    await user.upload(fileInput, file);

    // Clicar salvar
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining("user-123/bills/"),
        file,
        {
          upsert: true,
          contentType: "application/pdf",
        }
      );

      expect(mockInsert).toHaveBeenCalledWith({
        title: "Conta de Energia",
        description: "Referente a março",
        amount: 150.5,
        total_installments: 1,
        current_installment: 1,
        next_due_date: null,
        type: "bill",
        status: "pendente",
        proof: "http://example.com/comprovante.pdf",
        user_id: "user-123",
        update_at: expect.any(String),
      });

      expect(toast).toHaveBeenCalledWith({
        title: "Conta adicionada!",
      });
    });

    expect(mockOnSaved).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});