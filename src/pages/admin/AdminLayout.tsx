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
  Shield,
  LogOut,
  ChevronLeft,
  ExternalLink,
  User,
  Settings,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo-unique-light.jpg";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/medicos", icon: Users, label: "Médicos", end: false },
  { to: "/admin/institutos", icon: Building2, label: "Institutos", end: false },
  { to: "/admin/depoimentos", icon: MessageSquareQuote, label: "Depoimentos", end: false },
  { to: "/admin/galeria", icon: Image, label: "Galeria", end: false },
  { to: "/admin/convenios", icon: Shield, label: "Convênios", end: false },
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
        className={`fixed md:relative z-40 h-full bg-primary text-primary-foreground transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-[72px]" : "w-60"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 border-b border-primary-foreground/10 ${isCollapsed ? "px-3 py-4 justify-center" : "px-5 py-4"}`}>
          <img
            src={logoImg}
            alt="Grupo Unique"
            className={`shrink-0 rounded ${isCollapsed ? "h-7 w-7 object-cover" : "h-8 object-contain"}`}
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

        {/* Footer with User Popover */}
        <div className={`border-t border-primary-foreground/10 ${isCollapsed ? "p-2" : "px-3 py-3"}`}>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 transition-all duration-150 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground text-[11px] font-medium">
                    {user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <span className="text-[12px] truncate flex-1 text-left">{user.email}</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-56 p-0">
              <PopoverHeader>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <PopoverTitle>Administrador</PopoverTitle>
                  <PopoverDescription className="truncate">{user.email}</PopoverDescription>
                </div>
              </PopoverHeader>
              <PopoverBody className="space-y-1 px-2 py-1">
                <Button variant="ghost" className="w-full justify-start text-xs" size="sm" asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver site
                  </a>
                </Button>
              </PopoverBody>
              <PopoverFooter>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                  onClick={() => signOut().then(() => navigate("/admin/login"))}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-secondary/30">
        <div className="p-5 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
