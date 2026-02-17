import { motion } from "framer-motion";
import { Building2, Stethoscope, TestTube, Armchair, Heart, Monitor } from "lucide-react";

const spaces = [
  {
    icon: Building2,
    label: "Recepção",
    description: "Ambiente amplo e acolhedor",
    span: "col-span-1 md:col-span-2 row-span-1",
    gradient: "from-primary/15 to-accent/10",
  },
  {
    icon: Stethoscope,
    label: "Consultório",
    description: "Equipamentos modernos",
    span: "col-span-1 row-span-1",
    gradient: "from-accent/15 to-primary/10",
  },
  {
    icon: TestTube,
    label: "Laboratório",
    description: "Resultados em até 24h",
    span: "col-span-1 row-span-1",
    gradient: "from-primary/10 to-accent/15",
  },
  {
    icon: Armchair,
    label: "Sala de Espera",
    description: "Conforto e tranquilidade",
    span: "col-span-1 row-span-1",
    gradient: "from-accent/10 to-primary/15",
  },
  {
    icon: Monitor,
    label: "Centro de Diagnóstico",
    description: "Tecnologia de ponta",
    span: "col-span-1 md:col-span-2 row-span-1",
    gradient: "from-primary/15 to-accent/10",
  },
];

const ClinicGallerySection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">
          Nossa Estrutura
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          Conheça nosso espaço
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Um ambiente pensado para o seu conforto e bem-estar, com infraestrutura completa.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {spaces.map((space, i) => (
          <motion.div
            key={space.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.1,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`${space.span} group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${space.gradient} cursor-default`}
          >
            <div className="flex flex-col items-center justify-center text-center p-10 min-h-[180px] transition-transform duration-300 group-hover:scale-[1.03]">
              <div className="w-14 h-14 rounded-2xl bg-card/80 border border-border flex items-center justify-center mb-4 shadow-sm">
                <space.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">
                {space.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {space.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-muted-foreground mt-6"
      >
        * Fotos reais do espaço em breve
      </motion.p>
    </div>
  </section>
);

export default ClinicGallerySection;
