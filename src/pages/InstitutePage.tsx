import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, CheckCircle, Calendar, MapPin, User, ChevronRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getWhatsAppLink } from "@/data/mockData";

import type { Easing } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as Easing },
  }),
};

const InstitutePage = () => {
  const { id } = useParams();

  const { data: institute, isLoading } = useQuery({
    queryKey: ["public-institute", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("institutes").select("*").eq("slug", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: instituteDoctors = [] } = useQuery({
    queryKey: ["public-institute-doctors", institute?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("institute_id", institute!.id).order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!institute?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Unidade não encontrada</h1>
          <Link to="/institutos" className="text-primary hover:underline text-sm">Voltar às unidades</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <div className="relative">
        {institute.image_url ? (
          <div className="h-56 md:h-72 w-full overflow-hidden">
            <img src={institute.image_url} alt={institute.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : (
          <div className="h-32 md:h-44 w-full bg-gradient-to-br from-primary/10 via-accent/5 to-secondary" />
        )}

        <div className="container mx-auto px-4 relative" style={{ marginTop: institute.image_url ? "-5rem" : "-2rem" }}>
          <Link to="/institutos" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-4 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
            <ArrowLeft className="w-3 h-3" /> Voltar
          </Link>

          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
            {institute.category && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                <MapPin size={12} />
                {institute.category}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{institute.name}</h1>
            {institute.description && (
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{institute.description}</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Serviços */}
            {institute.services.length > 0 && (
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                <div className="flex items-center gap-2 mb-5">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Serviços e Especialidades</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {institute.services.map((service, i) => (
                    <motion.div
                      key={service}
                      custom={i + 2}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Médicos */}
            {instituteDoctors.length > 0 && (
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Corpo Clínico</h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full ml-1">{instituteDoctors.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instituteDoctors.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      custom={i + 4}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                    >
                      <Link
                        to={`/medico/${doc.slug}`}
                        className="group flex items-center gap-4 bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 hover:shadow-md transition-all"
                      >
                        {doc.photo_url ? (
                          <img src={doc.photo_url} alt={doc.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-border" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                            <User className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{doc.name}</h4>
                          <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">CRM {doc.crm}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="sticky top-28 space-y-4"
            >
              <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Agende sua Consulta</h3>
                    <p className="text-xs text-muted-foreground">Rápido e fácil pelo WhatsApp</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Entre em contato e agende sua consulta com os especialistas do {institute.name}.
                </p>
                <a href={getWhatsAppLink(`Olá! Gostaria de agendar uma consulta no ${institute.name}.`)} className="block">
                  <Button className="w-full hero-gradient border-0 text-primary-foreground rounded-xl h-11">
                    <Phone className="w-4 h-4 mr-2" /> Agendar pelo WhatsApp
                  </Button>
                </a>
                <p className="text-[11px] text-muted-foreground text-center mt-3">
                  Seg–Sex: 7h–19h
                </p>
              </div>

              {/* Quick info */}
              {institute.category && (
                <div className="bg-card rounded-2xl p-5 border border-border/50">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Informações</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm">
                      <MapPin size={14} className="text-primary shrink-0" />
                      <span className="text-foreground">{institute.category}</span>
                    </div>
                    {institute.services.length > 0 && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Stethoscope size={14} className="text-primary shrink-0" />
                        <span className="text-foreground">{institute.services.length} serviços</span>
                      </div>
                    )}
                    {instituteDoctors.length > 0 && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <User size={14} className="text-primary shrink-0" />
                        <span className="text-foreground">{instituteDoctors.length} médico(s)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstitutePage;
