import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, User, Award, Stethoscope, GraduationCap, Calendar, Building2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getWhatsAppLink } from "@/data/mockData";

const ease = [0.22, 1, 0.36, 1] as const;

const DoctorProfile = () => {
  const { id } = useParams();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["public-doctor", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("slug", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: doctorInstitutes = [] } = useQuery({
    queryKey: ["public-doctor-institutes", doctor?.id],
    queryFn: async () => {
      const { data: links, error: linkError } = await supabase
        .from("doctor_institutes")
        .select("institute_id")
        .eq("doctor_id", doctor!.id);
      if (linkError) throw linkError;
      if (!links || links.length === 0) return [];
      const ids = links.map((l) => (l as any).institute_id);
      const { data, error } = await supabase.from("institutes").select("*").in("id", ids);
      if (error) throw error;
      return data;
    },
    enabled: !!doctor?.id,
  });

  // Collect all unique services from all linked institutes
  const allServices = [...new Set(doctorInstitutes.flatMap((inst) => inst.services))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Médico não encontrado</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const bioSentences = doctor.bio.split(". ").filter(Boolean).map(s => s.endsWith(".") ? s : s + ".");

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease }}
          className="relative bg-card rounded-3xl overflow-hidden card-shadow border border-border"
        >
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-accent" />

          <div className="px-8 pt-8 pb-6 md:px-10 md:pt-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease }}
                className="relative shrink-0"
              >
                {doctor.photo_url ? (
                  <img src={doctor.photo_url} alt={doctor.name} className="w-28 h-28 rounded-2xl object-cover border-2 border-primary/20 shadow-lg" />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/20 flex items-center justify-center shadow-lg">
                    <User className="w-14 h-14 text-primary/60" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <BadgeCheck className="w-4 h-4 text-primary-foreground" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease }}
                className="text-center sm:text-left flex-1"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
                  {doctor.name}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
                    <Stethoscope className="w-3.5 h-3.5" /> {doctor.specialty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    <Award className="w-3.5 h-3.5" /> {doctor.crm}
                  </span>
                  {doctorInstitutes.map((inst) => (
                    <Link
                      key={inst.id}
                      to={`/instituto/${inst.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5" /> {inst.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mx-8 md:mx-10 h-px bg-border" />

          <div className="px-8 py-8 md:px-10 md:py-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground uppercase tracking-wide">Formação & Experiência</h2>
              </div>
              <div className="space-y-3 pl-2">
                {bioSentences.map((sentence, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{sentence}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {allServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="text-base font-bold text-foreground uppercase tracking-wide">Áreas de Atuação</h2>
                </div>
                <div className="flex flex-wrap gap-2 pl-2">
                  {allServices.map((service, i) => (
                    <motion.span
                      key={service}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.05, duration: 0.3, ease }}
                      className="text-sm font-medium text-foreground/80 bg-secondary border border-border/50 px-3.5 py-1.5 rounded-full"
                    >
                      {service}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5, ease }}
              className="bg-gradient-to-br from-primary/5 via-secondary/80 to-accent/5 rounded-2xl p-6 border border-primary/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Agende sua Consulta</h3>
                  <p className="text-xs text-muted-foreground">Atendimento rápido pelo WhatsApp</p>
                </div>
              </div>
              <a href={getWhatsAppLink(`Olá! Gostaria de agendar uma consulta com ${doctor.name} (${doctor.specialty}).`)}>
                <Button size="lg" className="w-full sm:w-auto hero-gradient border-0 text-primary-foreground rounded-full px-8 mt-3 group">
                  <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Agendar com {doctor.name}
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default DoctorProfile;
