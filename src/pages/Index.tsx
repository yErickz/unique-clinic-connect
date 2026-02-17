import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, CheckCircle, ArrowRight, Heart, Target, Eye, Users, MapPin, Clock, Mail, Stethoscope, Shield, Star, TestTube, Droplets, Activity, Pill, Dna } from "lucide-react";
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
import ginecologiaImg from "@/assets/services/ginecologia.jpg";

const serviceImages: Record<string, string> = {
  cardiologia: cardiologiaImg,
  ortopedia: ortopediaImg,
  dermatologia: dermatologiaImg,
  oftalmologia: oftalmologiaImg,
  laboratorio: laboratorioImg,
  ginecologia: ginecologiaImg,
};

const features = [
  { icon: Shield, text: "Resultado em até 24h" },
  { icon: Stethoscope, text: "Atendimento humanizado" },
  { icon: Star, text: "Tecnologia de ponta" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--teal-light))] via-background to-secondary" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[hsl(var(--teal)/0.06)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}>
              <motion.div variants={stagger} initial="hidden" animate="visible">
                <motion.span
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-accent/20"
                >
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Agendamento Online
                </motion.span>
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.1] mb-6 text-balance"
                >
                  Sua saúde em{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    boas mãos
                  </span>
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg"
                >
                  Saúde, bem-estar e day clinic. Atendimento humanizado, tecnologia de última geração e os melhores especialistas reunidos em um só lugar.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto hero-gradient border-0 text-primary-foreground rounded-full px-8 text-base group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                      <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> Agendar pelo WhatsApp
                    </Button>
                  </a>
                  <a href="#servicos" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base border-2 group hover:bg-accent/5 hover:border-accent hover:text-accent transition-all">
                      Nossos Serviços <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <feat.icon className="w-4 h-4 text-accent" />
                      </div>
                      {feat.text}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: 8 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent z-10" />
                <motion.img
                  src={heroImage}
                  alt="Clínica Unique — Ambiente moderno e acolhedor"
                  className="w-full h-[520px] object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
                className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-5 shadow-lg border border-border z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">Tudo em um só lugar</div>
                    <div className="text-sm text-muted-foreground">4 institutos especializados</div>
                  </div>
                </div>
              </motion.div>
              {/* Floating badge top-right */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1.1, duration: 0.5, type: "spring" }}
                className="absolute -top-3 -right-3 bg-accent text-accent-foreground rounded-2xl px-4 py-2.5 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-bold">Referência em Tucumã</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sobre o Grupo Unique */}
      <section id="sobre" className="py-24 section-divider">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Quem Somos</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Sobre o Grupo Unique
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                O Grupo Unique nasceu da união de profissionais comprometidos com a saúde e o bem-estar da nossa comunidade. Reunimos especialistas renomados e tecnologia de ponta em um único lugar, para que você tenha acesso ao melhor da medicina com praticidade e confiança.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Cada paciente é único — e é assim que tratamos você. Com atendimento individualizado e um ambiente acolhedor, cuidamos da sua saúde com a seriedade e o carinho que você merece.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { icon: Target, title: "Missão", desc: "Promover saúde com excelência, humanização e responsabilidade.", gradient: "from-primary/15 to-primary/5", iconBg: "bg-primary/15", iconColor: "text-primary", borderColor: "hover:border-primary/30" },
                  { icon: Eye, title: "Visão", desc: "Ser referência em confiança e qualidade para a nossa comunidade.", gradient: "from-accent/15 to-accent/5", iconBg: "bg-accent/15", iconColor: "text-accent", borderColor: "hover:border-accent/30" },
                  { icon: Heart, title: "Valores", desc: "Ética, empatia, inovação e compromisso com cada paciente.", gradient: "from-primary/15 to-accent/5", iconBg: "bg-primary/15", iconColor: "text-primary", borderColor: "hover:border-primary/30" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className={`relative overflow-hidden bg-card border border-border rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 ${item.borderColor}`}
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-4`}>
                      <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-2">{item.title}</h3>
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
              <div className="bg-gradient-to-br from-secondary to-[hsl(var(--teal-light))] rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "4", label: "Institutos especializados", accent: false },
                    { value: "24h", label: "Resultados de exames", accent: true },
                    { value: "2", label: "Convênios aceitos", accent: true },
                    { value: "< 15min", label: "Tempo médio de espera", accent: false },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      className="bg-card rounded-2xl p-6 card-shadow border border-border text-center cursor-default hover:card-shadow-hover transition-shadow"
                    >
                      <div className={`text-3xl font-bold mb-1 ${item.accent ? "text-accent" : "text-primary"}`}>{item.value}</div>
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
      <section id="servicos" className="py-24 bg-secondary/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Especialidades</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
              Todos os cuidados que você precisa
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Especialistas dedicados em cada área para oferecer o melhor diagnóstico e tratamento.
            </p>
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

      {/* Exames Mais Escolhidos */}
      <section className="py-24 section-divider">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Exames mais pesquisados
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {[
              { name: "Hemograma", price: "R$ 45,00" },
              { name: "Glicemia", price: "R$ 30,00" },
              { name: "Colesterol Total", price: "R$ 35,00" },
              { name: "Hormônios (TSH)", price: "R$ 55,00" },
              { name: "Função Renal", price: "R$ 40,00" },
            ].map((exam, i) => (
              <motion.div
                key={exam.name}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-card border border-border/50 rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:border-accent/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-foreground text-base uppercase mb-3">{exam.name}</h3>
                  <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Coberto por convênios
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Particular a partir de</p>
                  <p className="text-2xl font-bold text-foreground mb-4">{exam.price}</p>
                  <a
                    href={getWhatsAppLink(`Olá! Gostaria de saber mais sobre o exame de ${exam.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1 transition-colors"
                  >
                    Saiba mais <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <a
              href={getWhatsAppLink("Olá! Gostaria de ver mais exames disponíveis.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1 transition-colors"
            >
              Ver mais exames <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Convênios Aceitos */}
      <section id="convenios" className="py-20 section-divider">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Planos de Saúde</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
              Convênios Aceitos
            </h2>
            <p className="text-muted-foreground">Também atendemos de forma particular.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {convenios.map((conv, i) => (
              <motion.div
                key={conv}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -3, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-6 card-shadow hover:border-accent hover:card-shadow-hover transition-all cursor-default text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <span className="font-semibold text-foreground">{conv}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.03, y: -3, transition: { duration: 0.2 } }}
              className="bg-secondary/60 border border-border/50 rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all cursor-default text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Particular</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contato Básico */}
      <section className="py-20 bg-secondary/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Fale Conosco</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Onde nos encontrar
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: MapPin, title: "Endereço", text: "Av. Pará, 1136, Térreo\nCentro, Tucumã - PA" },
              { icon: Phone, title: "Telefone", text: "(94) 99277-5857" },
              { icon: Clock, title: "Horários", text: "Seg–Sex: 8h às 18h" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card border border-border rounded-2xl p-6 card-shadow text-center hover:card-shadow-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA Final */}
      <section className="relative overflow-hidden">
        <div className="py-24 relative">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] " />
          <div className="container mx-auto px-4 text-center relative z-10">
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
                className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground"
              >
                Pronto para cuidar da sua saúde?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-primary-foreground/70 mb-8 text-lg"
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
                  <Button size="lg" variant="secondary" className="rounded-full px-10 text-base font-semibold text-primary group shadow-lg hover:shadow-xl transition-shadow">
                    <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> Agendar Consulta
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
        {/* Transição suave para o footer */}
        <div className="h-24 bg-gradient-to-b from-primary to-foreground" />
      </section>
    </main>
  );
};

export default Index;