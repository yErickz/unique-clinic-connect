import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, NavLink as RouterNavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Building2,
  MessageSquareQuote,
  FileText,
  Image,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
} from "lucide-react";
import logoImg from "@/assets/logo-unique-navy-cropped.png";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/medicos", icon: Users, label: "Médicos", end: false },
  { to: "/admin/institutos", icon: Building2, label: "Institutos", end: false },
  { to: "/admin/depoimentos", icon: MessageSquareQuote, label: "Depoimentos", end: false },
  { to: "/admin/galeria", icon: Image, label: "Galeria", end: false },
  { to: "/admin/conteudo", icon: FileText, label: "Conteúdo", end: false },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="flex h-screen bg-secondary/30">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground md:hidden shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-full bg-card border-r border-border transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-16" : "w-56"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-border ${isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"}`}>
          {!isCollapsed && (
            <img src={logoImg} alt="Grupo Unique" className="h-6 shrink-0" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 ${!isCollapsed ? "ml-auto" : ""}`}
          >
            {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-2 ${isCollapsed ? "px-1.5" : "px-2"} space-y-0.5`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2.5 rounded-lg transition-colors duration-150 text-[13px] ${
                    isCollapsed ? "px-0 py-2 justify-center" : "px-3 py-2"
                  } ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <Icon size={17} className="shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className={`border-t border-border ${isCollapsed ? "p-1.5" : "p-2"} space-y-0.5`}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-[12px] ${isCollapsed ? "px-0 justify-center" : ""}`}
          >
            <ExternalLink size={14} className="shrink-0" />
            {!isCollapsed && <span>Ver site</span>}
          </a>

          {!isCollapsed && (
            <p className="text-[11px] text-muted-foreground truncate px-3 py-1">{user.email}</p>
          )}

          <button
            onClick={() => signOut().then(() => navigate("/admin/login"))}
            className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-[13px] ${
              isCollapsed ? "px-0 justify-center" : ""
            }`}
          >
            <LogOut size={15} className="shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-5 md:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
