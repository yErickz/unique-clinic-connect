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
  Calendar,
  Clock,
  Sparkles,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

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

  const { data: recentDoctors } = useQuery({
    queryKey: ["admin-recent-doctors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("doctors")
        .select("name, specialty, photo_url, created_at")
        .order("created_at", { ascending: false })
        .limit(4);
      return data ?? [];
    },
  });

  const { data: recentTestimonials } = useQuery({
    queryKey: ["admin-recent-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("patient_initials, quote, rating, specialty, is_published, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const stats = [
    {
      label: "Médicos",
      value: doctorCount ?? 0,
      icon: Users,
      route: "/admin/medicos",
      color: "bg-blue-50 text-blue-600",
      accent: "from-blue-500 to-blue-600",
    },
    {
      label: "Institutos",
      value: instituteCount ?? 0,
      icon: Building2,
      route: "/admin/institutos",
      color: "bg-emerald-50 text-emerald-600",
      accent: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Depoimentos",
      value: testimonialCount ?? 0,
      icon: MessageSquareQuote,
      route: "/admin/depoimentos",
      color: "bg-amber-50 text-amber-600",
      accent: "from-amber-500 to-amber-600",
    },
  ];

  const quickActions = [
    { label: "Gerenciar Médicos", icon: Stethoscope, route: "/admin/medicos", description: "Adicionar ou editar profissionais" },
    { label: "Galeria de Fotos", icon: Image, route: "/admin/galeria", description: "Atualizar fotos da clínica" },
    { label: "Editar Conteúdo", icon: FileText, route: "/admin/conteudo", description: "Textos, FAQ e exames" },
    { label: "Institutos", icon: Building2, route: "/admin/institutos", description: "Especialidades e serviços" },
  ];

  const firstName = user?.email?.split("@")[0] ?? "Admin";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent/80 p-6 md:p-8 text-primary-foreground"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/40 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary-foreground/60 text-xs mb-3">
            <Calendar size={13} />
            <span className="capitalize">{today}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-primary-foreground/70 mt-1.5 text-sm max-w-lg">
            Gerencie o conteúdo do site do Grupo Unique. Acompanhe os números e mantenha tudo atualizado.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              onClick={() => navigate(s.route)}
              className="group relative bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${s.accent} -translate-y-1/2 translate-x-1/3`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>
                <p className="text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label} cadastrados</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Grid: Recent + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock size={15} className="text-accent" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Médicos recentes</h2>
            </div>
            <button
              onClick={() => navigate("/admin/medicos")}
              className="text-xs text-accent hover:underline font-medium flex items-center gap-1"
            >
              Ver todos <ArrowUpRight size={12} />
            </button>
          </div>

          {recentDoctors && recentDoctors.length > 0 ? (
            <div className="space-y-2.5">
              {recentDoctors.map((doc, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {doc.photo_url ? (
                      <img src={doc.photo_url} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{doc.specialty}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 shrink-0">
                    {new Date(doc.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users size={28} className="text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">Nenhum médico cadastrado ainda</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles size={15} className="text-accent" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Atalhos rápidos</h2>
          </div>
          <div className="space-y-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  onClick={() => navigate(action.route)}
                  className="group w-full flex items-center gap-3 rounded-xl px-3.5 py-3 hover:bg-secondary/60 transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                    <Icon size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{action.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Testimonials */}
      {recentTestimonials && recentTestimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <MessageSquareQuote size={15} className="text-accent" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Depoimentos recentes</h2>
            </div>
            <button
              onClick={() => navigate("/admin/depoimentos")}
              className="text-xs text-accent hover:underline font-medium flex items-center gap-1"
            >
              Ver todos <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentTestimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="p-4 rounded-xl bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {t.patient_initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <span key={s} className="text-accent text-xs">★</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{t.specialty}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      t.is_published 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {t.is_published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
