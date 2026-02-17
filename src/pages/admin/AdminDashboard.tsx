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
    <div className="space-y-5 md:space-y-8 pb-8 pt-10 md:pt-0">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-primary to-accent/80 p-5 md:p-8 text-primary-foreground"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 rounded-full bg-accent/40 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 rounded-full bg-primary-foreground/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary-foreground/60 text-[11px] md:text-xs mb-2 md:mb-3">
            <Calendar size={12} />
            <span className="capitalize">{today}</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-primary-foreground/70 mt-1 md:mt-1.5 text-xs md:text-sm max-w-lg">
            Gerencie o conteúdo do site do Grupo Unique.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5 md:gap-4">
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
              className="group relative bg-card rounded-xl md:rounded-2xl p-3 md:p-5 border border-border hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${s.accent} -translate-y-1/2 translate-x-1/3`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${s.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 truncate">{s.label}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Actions - horizontal scroll on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Sparkles size={14} className="text-accent" />
          </div>
          <h2 className="text-xs md:text-sm font-semibold text-foreground">Atalhos rápidos</h2>
        </div>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 md:grid md:grid-cols-4 md:overflow-visible">
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
                className="group flex-shrink-0 w-[140px] md:w-auto flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 bg-card rounded-xl p-3.5 md:px-4 md:py-3.5 border border-border hover:border-accent/30 hover:shadow-md transition-all text-center md:text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                  <Icon size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground truncate hidden md:block">{action.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Grid: Recent Doctors + Testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="lg:col-span-2 bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-5"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock size={14} className="text-accent" />
              </div>
              <h2 className="text-xs md:text-sm font-semibold text-foreground">Médicos recentes</h2>
            </div>
            <button
              onClick={() => navigate("/admin/medicos")}
              className="text-[11px] md:text-xs text-accent hover:underline font-medium flex items-center gap-1"
            >
              Ver todos <ArrowUpRight size={11} />
            </button>
          </div>

          {recentDoctors && recentDoctors.length > 0 ? (
            <div className="space-y-1.5 md:space-y-2.5">
              {recentDoctors.map((doc, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {doc.photo_url ? (
                      <img src={doc.photo_url} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-foreground truncate">{doc.name}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">{doc.specialty}</p>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground/60 shrink-0 hidden sm:block">
                    {new Date(doc.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 md:py-10 text-center">
              <Users size={24} className="text-muted-foreground/30 mb-2" />
              <p className="text-[11px] md:text-xs text-muted-foreground">Nenhum médico cadastrado ainda</p>
            </div>
          )}
        </motion.div>

        {/* Recent Testimonials */}
        {recentTestimonials && recentTestimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-5"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquareQuote size={14} className="text-accent" />
                </div>
                <h2 className="text-xs md:text-sm font-semibold text-foreground">Depoimentos</h2>
              </div>
              <button
                onClick={() => navigate("/admin/depoimentos")}
                className="text-[11px] md:text-xs text-accent hover:underline font-medium flex items-center gap-1"
              >
                Ver todos <ArrowUpRight size={11} />
              </button>
            </div>
            <div className="space-y-2.5">
              {recentTestimonials.map((t, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="p-3 md:p-4 rounded-lg md:rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] md:text-xs font-bold text-accent">
                      {t.patient_initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, s) => (
                          <span key={s} className="text-accent text-[10px] md:text-xs">★</span>
                        ))}
                      </div>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{t.specialty}</p>
                    </div>
                    <span className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      t.is_published
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {t.is_published ? "Pub." : "Rasc."}
                    </span>
                  </div>
                  <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2 leading-relaxed">"{t.quote}"</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
