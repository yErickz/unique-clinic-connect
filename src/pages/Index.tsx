import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { institutes, convenios, getWhatsAppLink } from "@/data/mockData";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FaqSection from "@/components/FaqSection";

// Import service images
import cardiologiaImg from "@/assets/services/cardiologia.jpg";
import ortopediaImg from "@/assets/services/ortopedia.jpg";
import dermatologiaImg from "@/assets/services/dermatologia.jpg";
import oftalmologiaImg from "@/assets/services/oftalmologia.jpg";
import laboratorioImg from "@/assets/services/laboratorio.jpg";
import domiciliarImg from "@/assets/services/domiciliar.jpg";

const serviceImages: Record<string, string> = {
  cardiologia: cardiologiaImg,
  ortopedia: ortopediaImg,
  dermatologia: dermatologiaImg,
  oftalmologia: oftalmologiaImg,
  laboratorio: laboratorioImg,
  domiciliar: domiciliarImg,
};

const Index = () => (
  <main>
    <HeroSection />
    <StatsSection />

    {/* Serviços */}
    <section id="servicos" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Serviços para você
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {institutes.map((inst, i) => (
            <ServiceCard 
              key={inst.id} 
              id={inst.id}
              category={inst.category}
              title={inst.name}
              description={inst.description}
              image={serviceImages[inst.id] || cardiologiaImg}
              index={i} 
            />
          ))}
        </div>
      </div>
    </section>

    {/* Convênios */}
    <section id="convenios" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Planos de Saúde</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Convênios Aceitos
          </h2>
          <p className="text-muted-foreground">Trabalhamos com os principais planos de saúde do Brasil.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {convenios.map((conv, i) => (
            <motion.span
              key={conv}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground card-shadow hover:border-primary hover:text-primary transition-colors cursor-default"
            >
              {conv}
            </motion.span>
          ))}
        </div>
      </div>
    </section>

    <FaqSection />

    {/* CTA */}
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para cuidar da sua saúde?
          </h2>
          <p className="opacity-70 mb-8 text-lg">
            Agende sua consulta agora mesmo pelo WhatsApp. Nossa equipe está pronta para atendê-lo com todo o cuidado que você merece.
          </p>
          <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 text-base">
              <Phone className="w-5 h-5 mr-2" /> Agendar Consulta
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Index;
