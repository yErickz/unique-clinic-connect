import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Atendimento excelente e muito humanizado. Me senti acolhida desde a recepção até a consulta. Recomendo de olhos fechados!",
    initials: "M.S.",
    specialty: "Cardiologia",
    rating: 5,
  },
  {
    quote: "Resultados dos exames rápidos e equipe muito atenciosa. O laboratório é organizado e o ambiente é muito limpo.",
    initials: "J.P.",
    specialty: "Laboratório",
    rating: 5,
  },
  {
    quote: "Médicos competentes e ambiente muito confortável. A clínica é moderna e o atendimento é pontual.",
    initials: "A.L.",
    specialty: "Ortopedia",
    rating: 5,
  },
  {
    quote: "Fiz meu check-up completo aqui e fiquei impressionada com a agilidade. Tudo resolvido em um único lugar.",
    initials: "R.C.",
    specialty: "Clínico Geral",
    rating: 5,
  },
  {
    quote: "Profissionais atenciosos e muito bem preparados. Me senti segura durante todo o procedimento.",
    initials: "L.M.",
    specialty: "Dermatologia",
    rating: 5,
  },
  {
    quote: "Estrutura excelente e equipe sempre disponível para tirar dúvidas. Minha família inteira se consulta aqui.",
    initials: "F.O.",
    specialty: "Oftalmologia",
    rating: 4,
  },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-secondary/40">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">
          Depoimentos
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          O que nossos pacientes dizem
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A confiança dos nossos pacientes é o nosso maior reconhecimento.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.1,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="relative bg-card border border-border rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:border-primary/20 transition-all duration-300"
          >
            {/* Quote icon */}
            <div className="absolute -top-3 -left-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-4 mt-2">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s < t.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-border"
                  }`}
                />
              ))}
            </div>

            {/* Quote text */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {t.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Paciente {t.initials}
                </p>
                <p className="text-xs text-muted-foreground">{t.specialty}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
