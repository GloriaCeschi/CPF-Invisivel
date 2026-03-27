import { ShieldCheck, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card px-6 py-10">
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-sm font-bold text-primary">Renda Visível</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Transformando sua relação com o dinheiro através da educação financeira acessível e empática.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold text-foreground">Institucional</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Sobre Nós</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold text-foreground">Contato</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>contato@rendavisivel.com.br</li>
            <li>(11) 99999-9999</li>
          </ul>
          <div className="mt-3 flex gap-3">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold text-foreground">Segurança</h4>
          <div className="flex items-center gap-2 rounded-md bg-muted p-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs font-medium text-foreground">Site Seguro</p>
              <p className="text-[10px] text-muted-foreground">Dados protegidos com criptografia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-border pt-4 text-center text-xs text-muted-foreground">
        © 2026 Renda Visível. Todos os direitos reservados.
      </div>
    </footer>
  );
}
