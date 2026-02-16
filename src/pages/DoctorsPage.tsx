import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Stethoscope, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doctors, institutes, getWhatsAppLink } from "@/data/mockData";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const DoctorsPage = () => (
  <main className="pt-32 pb-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Corpo Clínico</span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          Nossos Médicos
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Conheça os profissionais que fazem do Grupo Unique uma referência em saúde e confiança.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {doctors.map((doctor) => {
          const institute = institutes.find((i) => i.id === doctor.instituteId);
          return (
            <motion.div key={doctor.id} variants={fadeUp}>
              <Link
                to={`/medico/${doctor.id}`}
                className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover border border-border/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <User className="w-10 h-10 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h2 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-primary font-medium mb-1">
                    <Stethoscope className="w-4 h-4" />
                    {doctor.specialty}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Award className="w-3.5 h-3.5" />
                    {doctor.crm}
                  </div>
                  {institute && (
                    <span className="inline-block text-xs font-medium text-muted-foreground bg-secondary rounded-full px-3 py-1">
                      {institute.name}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-2">
                    {doctor.bio}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground mb-4">Quer agendar com um dos nossos especialistas?</p>
        <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta no Grupo Unique.")}>
          <Button className="hero-gradient border-0 text-primary-foreground rounded-full px-8 group">
            <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Agendar pelo WhatsApp
          </Button>
        </a>
      </motion.div>
    </div>
  </main>
);

export default DoctorsPage;