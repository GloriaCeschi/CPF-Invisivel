import { Instagram, Twitter, Linkedin, Mail, MapPin, Phone, Eye } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-16">
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-primary-foreground">
              Renda<span className="text-primary">Visível</span>
            </span>
          </div>
          <p className="text-primary-foreground/50 text-sm leading-relaxed">
            Tornando visível quem o sistema financeiro ignora. Inclusão financeira real para todos.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-4">Institucional</h4>
          <nav className="flex flex-col gap-2">
            {["Sobre nós", "Como funciona", "Parceiros", "Carreiras"].map((l) => (
              <a key={l} href="#" className="text-primary-foreground/50 text-sm hover:text-primary transition-colors">{l}</a>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-4">Suporte</h4>
          <nav className="flex flex-col gap-2">
            {["FAQ", "Termos de uso", "Política de privacidade", "Central de ajuda"].map((l) => (
              <a key={l} href="#" className="text-primary-foreground/50 text-sm hover:text-primary transition-colors">{l}</a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-4">Contato</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary-foreground/50 text-sm">
              <Mail className="w-4 h-4" /> contato@rendavisivel.com.br
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/50 text-sm">
              <Phone className="w-4 h-4" /> (11) 99999-0000
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/50 text-sm">
              <MapPin className="w-4 h-4" /> São Paulo, SP
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:bg-primary hover:text-primary-foreground transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 text-center">
        <p className="text-primary-foreground/30 text-sm">
          © 2025 Renda Visível. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
