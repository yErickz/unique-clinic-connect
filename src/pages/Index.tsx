import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, Shield, Clock, Users, CheckCircle, ArrowRight, Heart, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { institutes, convenios, getWhatsAppLink } from "@/data/mockData";
import heroImage from "@/assets/hero-sabin-style.jpg";
import FaqSection from "@/components/FaqSection";
import { useRef } from "react";

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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="overflow-x-hidden">
      {/* Hero with parallax */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6"
                >
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Agendamento Online
                </motion.span>
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance"
                >
                  Sua saúde em <span className="text-primary">boas mãos</span>
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg"
                >
                  Saúde, bem-estar e day clinic. Atendimento humanizado, tecnologia de última geração e os melhores especialistas.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")}>
                    <Button size="lg" className="hero-gradient border-0 text-primary-foreground rounded-full px-8 text-base group">
                      <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> Agendar pelo WhatsApp
                    </Button>
                  </a>
                  <a href="#servicos">
                    <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-2 group">
                      Ver Serviços <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </motion.div>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-6">
                  {features.map((feat, i) => (
                    <motion.div
                      key={feat.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <feat.icon className="w-5 h-5 text-primary" />
                      {feat.text}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl" />
              <motion.img
                src={heroImage}
                alt="Clínica Unique"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
                className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-5 card-shadow border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">50k+</div>
                    <div className="text-sm text-muted-foreground">Pacientes satisfeitos</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - animated counters feel */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="text-center cursor-default"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <stat.icon className="w-10 h-10 mx-auto mb-4 opacity-80" />
                </motion.div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sobre o Grupo Unique */}
      <section id="sobre" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Quem Somos</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Sobre o Grupo Unique
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Fundado com a missão de oferecer saúde de excelência, o Grupo Unique nasceu da união de profissionais apaixonados por cuidar de pessoas. Ao longo dos anos, nos consolidamos como referência em atendimento humanizado, reunindo especialistas renomados e tecnologia de ponta em um único lugar.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Acreditamos que cada paciente merece atenção individualizada e um ambiente acolhedor. Por isso, investimos continuamente em infraestrutura, capacitação e inovação para proporcionar a melhor experiência em saúde para você e sua família.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Target, title: "Missão", desc: "Promover saúde e bem-estar com excelência, humanização e responsabilidade." },
                  { icon: Eye, title: "Visão", desc: "Ser a clínica referência em confiança e qualidade na nossa comunidade." },
                  { icon: Heart, title: "Valores", desc: "Ética, empatia, inovação e compromisso com cada paciente." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-card border border-border rounded-2xl p-5 card-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="bg-secondary rounded-3xl p-8 relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "15+", label: "Anos de história" },
                    { value: "50k+", label: "Pacientes atendidos" },
                    { value: "6", label: "Institutos especializados" },
                    { value: "30+", label: "Profissionais de saúde" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      className="bg-card rounded-2xl p-6 card-shadow border border-border text-center cursor-default"
                    >
                      <div className="text-3xl font-bold text-primary mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Planos de Saúde</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Convênios Aceitos
            </h2>
            <p className="text-muted-foreground">Trabalhamos com os principais planos de saúde do Brasil.</p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
          >
            {convenios.map((conv) => (
              <motion.span
                key={conv}
                variants={scaleUp}
                whileHover={{ scale: 1.08, y: -2, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground card-shadow hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {conv}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Pronto para cuidar da sua saúde?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="opacity-70 mb-8 text-lg"
            >
              Agende sua consulta agora mesmo pelo WhatsApp. Nossa equipe está pronta para atendê-lo com todo o cuidado que você merece.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 text-base group">
                  <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> Agendar Consulta
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Index;