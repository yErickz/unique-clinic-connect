import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const defaultTestimonials = [
  { quote: "Atendimento excelente e muito humanizado.", patient_initials: "M.S.", specialty: "Cardiologia", rating: 5 },
  { quote: "Resultados dos exames rápidos e equipe muito atenciosa.", patient_initials: "J.P.", specialty: "Laboratório", rating: 5 },
  { quote: "Médicos competentes e ambiente muito confortável.", patient_initials: "A.L.", specialty: "Ortopedia", rating: 5 },
];

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const perPage = isMobile ? 1 : 3;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const { data: testimonials = defaultTestimonials } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("quote, patient_initials, specialty, rating")
        .eq("is_published", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const totalPages = Math.ceil(testimonials.length / perPage);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setCurrent(next);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % totalPages, 1);
  }, [current, totalPages, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + totalPages) % totalPages, -1);
  }, [current, totalPages, goTo]);

  // Autoplay
  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, totalPages]);

  const visible = testimonials.slice(current * perPage, current * perPage + perPage);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="py-20 bg-secondary/40 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">O que nossos pacientes dizem</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A confiança dos nossos pacientes é o nosso maior reconhecimento.</p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-2 md:-left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border card-shadow flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute -right-2 md:-right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border card-shadow flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 ${perPage >= 3 ? "md:grid-cols-3" : ""} gap-6`}
            >
              {visible.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="relative bg-card border border-border rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:border-primary/20 transition-all duration-300"
                >
                  <div className="absolute -top-3 -left-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Quote className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-4 mt-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`w-4 h-4 ${s < t.rating ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{t.patient_initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Paciente {t.patient_initials}</p>
                      <p className="text-xs text-muted-foreground">{t.specialty}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Ir para página ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
