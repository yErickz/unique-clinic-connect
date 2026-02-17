import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultTestimonials = [
  { quote: "Atendimento excelente e muito humanizado.", patient_initials: "M.S.", specialty: "Cardiologia", rating: 5 },
  { quote: "Resultados dos exames rápidos e equipe muito atenciosa.", patient_initials: "J.P.", specialty: "Laboratório", rating: 5 },
  { quote: "Médicos competentes e ambiente muito confortável.", patient_initials: "A.L.", specialty: "Ortopedia", rating: 5 },
];

const TestimonialsSection = () => {
  const { data: testimonials = defaultTestimonials } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("quote, patient_initials, specialty, rating")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-20 bg-secondary/40">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
