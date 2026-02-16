import { motion } from "framer-motion";
import { Phone, Shield, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { institutes, convenios, getWhatsAppLink } from "@/data/mockData";
import heroImage from "@/assets/hero-sabin-style.jpg";
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

const features = [
  { icon: CheckCircle, text: "Resultado em até 24h" },
  { icon: CheckCircle, text: "Atendimento humanizado" },
  { icon: CheckCircle, text: "Tecnologia de ponta" },
];

const stats = [
  { icon: Users, label: "Pacientes atendidos", value: "50.000+" },
  { icon: Shield, label: "Anos de experiência", value: "15+" },
  { icon: Clock, label: "Tempo médio de espera", value: "< 15min" },
];

const Index = () => (
  <main>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Agendamento Online
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
              Sua saúde em <span className="text-primary">boas mãos</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Saúde, bem-estar e day clinic. Atendimento humanizado, tecnologia de última geração e os melhores especialistas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")}>
                <Button size="lg" className="hero-gradient border-0 text-primary-foreground rounded-full px-8 text-base">
                  <Phone className="w-5 h-5 mr-2" /> Agendar pelo WhatsApp
                </Button>
              </a>
              <a href="#servicos">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-2">
                  Ver Serviços <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap gap-6">
              {features.map((feat) => (
                <div key={feat.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feat.icon className="w-5 h-5 text-primary" />
                  {feat.text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl" />
            <img 
              src={heroImage} 
              alt="Clínica Unique" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-5 card-shadow border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">50k+</div>
                  <div className="text-sm text-muted-foreground">Pacientes satisfeitos</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Serviços - Estilo Delboni */}
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

    {/* FAQ */}
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
