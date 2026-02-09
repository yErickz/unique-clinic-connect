import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppLink } from "@/data/mockData";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Institutos", path: "/#institutos" },
  { label: "Convênios", path: "/#convenios" },
  { label: "Contato", path: "/contato" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">U</span>
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Grupo Unique
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta.")}>
            <Button size="sm" className="hero-gradient border-0 text-primary-foreground">
              <Phone className="w-4 h-4 mr-1" /> Agendar
            </Button>
          </a>
        </nav>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta.")}>
                <Button className="w-full hero-gradient border-0 text-primary-foreground mt-2">
                  <Phone className="w-4 h-4 mr-1" /> Agendar Consulta
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
