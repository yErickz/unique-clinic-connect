import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { getWhatsAppLink } from "@/data/mockData";
import logoNavy from "@/assets/logo-unique-navy-cropped.png";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Institutos", path: "/institutos" },
  { label: "Médicos", path: "/medicos" },
  { label: "Contato", path: "/contato" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    if (latest > 80 && diff > 5) {
      setHidden(true);
      setMobileOpen(false);
    } else if (diff < -5) {
      setHidden(false);
    }
    setScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return location.pathname === "/" && location.hash === path.replace("/", "");
    return location.pathname === path;
  };

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-2 left-2 right-2 z-50"
    >
      <div className={`container mx-auto px-6 h-14 flex items-center justify-between rounded-2xl transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border border-border/50 shadow-md"
          : "bg-background border border-border"
      }`}>
        <Link to="/" className="flex items-center gap-3">
          <img src={logoNavy} alt="Clínica Unique" className="h-10 w-auto object-contain" />
          <span className="text-lg font-bold text-foreground">Clínica Unique</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-sm font-medium transition-colors py-1 ${
                isActive(item.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
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
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-3 px-4 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta.")} className="mt-2">
                <Button className="w-full hero-gradient border-0 text-primary-foreground rounded-full">
                  <Phone className="w-4 h-4 mr-2" /> Agendar Consulta
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;