import { motion } from "framer-motion";
import { Phone, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import InstituteCard from "@/components/InstituteCard";
import { institutes, convenios, getWhatsAppLink } from "@/data/mockData";
import heroImage from "@/assets/hero-clinic.jpg";

const stats = [
  { icon: Users, label: "Pacientes atendidos", value: "50.000+" },
  { icon: Shield, label: "Anos de experiência", value: "15+" },
  { icon: Clock, label: "Tempo médio de espera", value: "< 15min" },
];

const Index = () => (
  <main>
    {/* Hero */}
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Clínica Grupo Unique" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4 text-balance">
            Sua saúde com quem entende do assunto
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
            Referência em atendimento médico multidisciplinar. Agende sua consulta em poucos cliques.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta no Grupo Unique.")}>
              <Button size="lg" className="hero-gradient border-0 text-primary-foreground text-base">
                <Phone className="w-5 h-5 mr-2" /> Agendar pelo WhatsApp
              </Button>
            </a>
            <a href="#institutos">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base">
                Nossos Institutos
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 bg-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Institutos */}
    <section id="institutos" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Nossos Institutos
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Especialidades médicas reunidas em um só lugar, com profissionais de excelência.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {institutes.map((inst, i) => (
            <InstituteCard key={inst.id} institute={inst} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Convênios */}
    <section id="convenios" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Convênios Aceitos
          </h2>
          <p className="text-muted-foreground">Trabalhamos com os principais planos de saúde do Brasil.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {convenios.map((conv) => (
            <motion.span
              key={conv}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground card-shadow"
            >
              {conv}
            </motion.span>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para cuidar da sua saúde?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Agende sua consulta agora mesmo pelo WhatsApp. Nossa equipe está pronta para atendê-lo.
          </p>
          <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta no Grupo Unique.")}>
            <Button size="lg" className="hero-gradient border-0 text-primary-foreground text-base">
              <Phone className="w-5 h-5 mr-2" /> Agendar Consulta
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Index;
