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
  LogOut,
  ChevronLeft,
} from "lucide-react";
import logoImg from "@/assets/logo-unique-navy-cropped.png";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/medicos", icon: Users, label: "Médicos", end: false },
  { to: "/admin/institutos", icon: Building2, label: "Institutos", end: false },
  { to: "/admin/depoimentos", icon: MessageSquareQuote, label: "Depoimentos", end: false },
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

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white md:hidden shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-full bg-slate-800 text-white transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={logoImg}
              alt="Grupo Unique"
              className={`shrink-0 ${isCollapsed ? "h-8 w-8 object-contain" : "h-8"}`}
            />
            {!isCollapsed && (
              <span className="text-xs text-slate-400">Painel Admin</span>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-700 transition-colors shrink-0"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className="shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </>
                )}
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-slate-700 ${isCollapsed ? "p-2" : "p-3"}`}>
          {!isCollapsed && (
            <p className="text-xs text-slate-400 truncate mb-2 px-3">{user.email}</p>
          )}
          <button
            onClick={() => signOut().then(() => navigate("/admin/login"))}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
