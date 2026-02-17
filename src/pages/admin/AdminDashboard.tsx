import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  MessageSquareQuote,
  ArrowRight,
  Image,
  FileText,
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
    { label: "Médicos", value: doctorCount ?? 0, icon: Users, route: "/admin/medicos" },
    { label: "Institutos", value: instituteCount ?? 0, icon: Building2, route: "/admin/institutos" },
    { label: "Depoimentos", value: testimonialCount ?? 0, icon: MessageSquareQuote, route: "/admin/depoimentos" },
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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Olá, {firstName}
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
              className="group bg-card rounded-xl p-5 border border-border hover:border-accent/30 transition-all duration-200 text-left hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-accent" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
              </div>
              <p className="text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label} cadastrados</p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Atalhos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="group flex items-center gap-3 bg-card rounded-xl px-4 py-3.5 border border-border hover:border-primary/20 transition-all duration-200 text-left hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
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
