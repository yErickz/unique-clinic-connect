import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { institutes, getWhatsAppLink } from "@/data/mockData";

import cardiologiaImg from "@/assets/services/cardiologia.jpg";
import ortopediaImg from "@/assets/services/ortopedia.jpg";
import dermatologiaImg from "@/assets/services/dermatologia.jpg";
import oftalmologiaImg from "@/assets/services/oftalmologia.jpg";
import laboratorioImg from "@/assets/services/laboratorio.jpg";
import ginecologiaImg from "@/assets/services/ginecologia.jpg";

const serviceImages: Record<string, string> = {
  cardiologia: cardiologiaImg,
  ortopedia: ortopediaImg,
  dermatologia: dermatologiaImg,
  oftalmologia: oftalmologiaImg,
  laboratorio: laboratorioImg,
  ginecologia: ginecologiaImg,
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const InstitutesPage = () => (
  <main className="pt-32 pb-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="text-accent text-sm font-semibold uppercase tracking-wider">Especialidades</span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          Nossos Institutos
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          O Grupo Unique reúne institutos especializados para oferecer o cuidado completo que você merece.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {institutes.map((inst) => (
          <motion.div key={inst.id} variants={fadeUp}>
            <Link
              to={`/instituto/${inst.id}`}
              className="group block bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover border border-border/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={serviceImages[inst.id] || cardiologiaImg}
                  alt={inst.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 block">
                  {inst.category}
                </span>
                <h2 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {inst.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {inst.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Ver detalhes <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground mb-4">Não sabe qual especialidade procurar?</p>
        <a href={getWhatsAppLink("Olá! Gostaria de ajuda para saber qual especialidade procurar.")}>
          <Button className="hero-gradient border-0 text-primary-foreground rounded-full px-8 group">
            <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Fale conosco pelo WhatsApp
          </Button>
        </a>
      </motion.div>
    </div>
  </main>
);

export default InstitutesPage;