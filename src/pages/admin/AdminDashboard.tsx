import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  MessageSquareQuote,
  ArrowUpRight,
  Image,
  FileText,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: doctorCount } = useQuery({
    queryKey: ["admin-doctor-count"],
    queryFn: async () => {
      const { count } = await supabase.from("doctors").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: instituteCount } = useQuery({
    queryKey: ["admin-institute-count"],
    queryFn: async () => {
      const { count } = await supabase.from("institutes").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ["admin-testimonial-count"],
    queryFn: async () => {
      const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Médicos", value: doctorCount ?? 0, icon: Users, route: "/admin/medicos", accent: "hsl(174 55% 42%)" },
    { label: "Institutos", value: instituteCount ?? 0, icon: Building2, route: "/admin/institutos", accent: "hsl(218 58% 55%)" },
    { label: "Depoimentos", value: testimonialCount ?? 0, icon: MessageSquareQuote, route: "/admin/depoimentos", accent: "hsl(37 90% 55%)" },
  ];

  const quickActions = [
    { label: "Gerenciar Médicos", icon: Users, route: "/admin/medicos", description: "Adicionar ou editar médicos" },
    { label: "Galeria de Fotos", icon: Image, route: "/admin/galeria", description: "Atualizar fotos da clínica" },
    { label: "Editar Conteúdo", icon: FileText, route: "/admin/conteudo", description: "Textos, FAQ e exames" },
  ];

  const firstName = user?.email?.split("@")[0] ?? "Admin";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Olá, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie o conteúdo do site da Clínica Unique.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => navigate(s.route)}
              className="group relative bg-card rounded-xl p-5 border border-border/60 hover:border-border transition-all duration-200 text-left overflow-hidden"
            >
              {/* Subtle glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: s.accent }}
              />

              <div className="flex items-center justify-between mb-4 relative">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.accent}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.accent }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
              </div>

              <p className="text-3xl font-bold tabular-nums relative">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 relative">{s.label} cadastrados</p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Atalhos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="group flex items-center gap-3 bg-card/50 rounded-xl px-4 py-3.5 border border-border/40 hover:border-border/80 hover:bg-card transition-all duration-200 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
