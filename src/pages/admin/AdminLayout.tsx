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
  ChevronLeft,
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-primary text-primary-foreground md:hidden shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-full bg-primary text-primary-foreground transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-[72px]" : "w-60"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 border-b border-primary-foreground/10 ${isCollapsed ? "px-3 py-4 justify-center" : "px-5 py-4"}`}>
          <img
            src={logoImg}
            alt="Grupo Unique"
            className={`shrink-0 brightness-0 invert ${isCollapsed ? "h-7 w-7 object-contain" : "h-7"}`}
          />
          {!isCollapsed && (
            <span className="text-[11px] font-medium uppercase tracking-widest text-primary-foreground/50">Admin</span>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex ml-auto p-1 rounded-md hover:bg-primary-foreground/10 transition-colors shrink-0"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 text-primary-foreground/50 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-3 ${isCollapsed ? "px-2" : "px-3"} space-y-0.5`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${
                    isCollapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-primary-foreground/15 text-primary-foreground font-medium"
                      : "text-primary-foreground/60 hover:bg-primary-foreground/8 hover:text-primary-foreground/90"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && (
                      <span className="text-[13px]">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </>
                )}
              </RouterNavLink>
            );
          })}
        </nav>

        {/* View Site Link */}
        <div className={`${isCollapsed ? "px-2" : "px-3"} pb-2`}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-primary-foreground/50 hover:text-primary-foreground/80 hover:bg-primary-foreground/5 transition-all text-[12px] ${isCollapsed ? "justify-center" : ""}`}
          >
            <ExternalLink size={14} className="shrink-0" />
            {!isCollapsed && <span>Ver site</span>}
          </a>
        </div>

        {/* Footer */}
        <div className={`border-t border-primary-foreground/10 ${isCollapsed ? "p-2" : "px-3 py-3"}`}>
          {!isCollapsed && (
            <p className="text-[11px] text-primary-foreground/35 truncate mb-1.5 px-3">{user.email}</p>
          )}
          <button
            onClick={() => signOut().then(() => navigate("/admin/login"))}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-primary-foreground/50 hover:bg-destructive/20 hover:text-destructive transition-all duration-150 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && <span className="text-[13px]">Sair</span>}
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
