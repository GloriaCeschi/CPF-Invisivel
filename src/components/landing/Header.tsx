import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Problema", href: "#problema" },
  { label: "Solução", href: "#solucao" },
  { label: "Quiz", href: "#quiz" },
  { label: "Depoimentos", href: "#social" },
  { label: "Contato", href: "#cta" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/90 backdrop-blur-xl shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">M</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            <span className="text-white">Renda</span><span className="text-secondary">Visível</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary after:transition-all hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-foreground">
            Login
          </Button>
          <Button size="sm" className="bg-gradient-cta text-primary-foreground hover:opacity-90 transition-opacity">
            Cadastro
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-4 pb-4"
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 text-left"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="sm" className="flex-1">Login</Button>
              <Button size="sm" className="flex-1 bg-gradient-cta text-primary-foreground">Cadastro</Button>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
