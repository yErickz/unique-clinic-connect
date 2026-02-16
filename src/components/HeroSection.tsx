import { motion } from "framer-motion";
import { Phone, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/data/mockData";
import heroImage from "@/assets/hero-fullscreen.jpg";

const features = [
  { icon: CheckCircle, text: "Resultado em até 24h" },
  { icon: CheckCircle, text: "Atendimento humanizado" },
  { icon: CheckCircle, text: "Tecnologia de ponta" },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    {/* Fullscreen background image */}
    <div className="absolute inset-0">
      <img
        src={heroImage}
        alt="Clínica Unique"
        className="w-full h-full object-cover"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(218,51%,10%)/0.92] via-[hsl(218,51%,14%)/0.80] to-[hsl(218,51%,18%)/0.50]" />
    </div>

    {/* Content */}
    <div className="container mx-auto px-4 relative z-10 pt-24 pb-20">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-5 py-2.5 rounded-full mb-8 border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Agendamento Online
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 text-balance"
        >
          Sua saúde em{" "}
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            boas mãos
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-lg"
        >
          Saúde, bem-estar e day clinic. Atendimento humanizado, tecnologia de
          última geração e os melhores especialistas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <a href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")}>
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 rounded-full px-8 text-base font-semibold shadow-lg shadow-black/20"
            >
              <Phone className="w-5 h-5 mr-2" /> Agendar pelo WhatsApp
            </Button>
          </a>
          <a href="#servicos">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base border-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Ver Serviços <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-6"
        >
          {features.map((feat) => (
            <div
              key={feat.text}
              className="flex items-center gap-2 text-sm text-white/60"
            >
              <feat.icon className="w-5 h-5 text-green-400" />
              {feat.text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Bottom fade to page */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default HeroSection;
