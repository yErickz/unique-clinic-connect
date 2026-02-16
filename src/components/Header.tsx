import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getWhatsAppLink } from "@/data/mockData";
import logoNavy from "@/assets/logo-unique-navy-cropped.png";

const navItems = [
{ label: "Início", path: "/" },
{ label: "Institutos", path: "/#institutos" },
{ label: "Convênios", path: "/#convenios" },
{ label: "Contato", path: "/contato" }];


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        

















      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoNavy} alt="Clínica Unique" className="h-10 w-auto object-contain" />
          <span className="text-lg font-bold text-foreground">Clínica Unique</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
          <Link
            key={item.path}
            to={item.path}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">

              {item.label}
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta.")}>
            <Button className="hero-gradient border-0 text-primary-foreground rounded-full px-6">
              <Phone className="w-4 h-4 mr-2" /> Agendar
            </Button>
          </a>
        </div>

        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}>

          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-t border-border">

            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) =>
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors">

                  {item.label}
                </Link>
            )}
              <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta.")} className="mt-2">
                <Button className="w-full hero-gradient border-0 text-primary-foreground rounded-full">
                  <Phone className="w-4 h-4 mr-2" /> Agendar Consulta
                </Button>
              </a>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

};

export default Header;