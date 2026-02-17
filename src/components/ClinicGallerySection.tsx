import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface GallerySpace {
  label: string;
  description: string;
  image_url?: string;
  span: string;
}

const defaultSpaces: GallerySpace[] = [
  { label: "Recepção", description: "Ambiente amplo e acolhedor", span: "wide" },
  { label: "Consultório", description: "Equipamentos modernos", span: "normal" },
  { label: "Laboratório", description: "Resultados em até 24h", span: "normal" },
  { label: "Sala de Espera", description: "Conforto e tranquilidade", span: "normal" },
  { label: "Centro de Diagnóstico", description: "Tecnologia de ponta", span: "wide" },
];

const gradients = [
  "from-primary/15 to-accent/10",
  "from-accent/15 to-primary/10",
  "from-primary/10 to-accent/15",
  "from-accent/10 to-primary/15",
  "from-primary/15 to-accent/10",
];

const ClinicGallerySection = () => {
  const { c, cJson } = useSiteContent();
  const spaces = cJson<GallerySpace[]>("gallery_data", defaultSpaces);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            {c("gallery_label", "Nossa Estrutura")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {c("gallery_title", "Conheça nosso espaço")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {c("gallery_subtitle", "Um ambiente pensado para o seu conforto e bem-estar, com infraestrutura completa.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {spaces.map((space, i) => {
            const spanClass = space.span === "wide" ? "col-span-1 md:col-span-2 row-span-1" : "col-span-1 row-span-1";
            const gradient = gradients[i % gradients.length];
            const hasImage = !!space.image_url;

            return (
              <motion.div
                key={`${space.label}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`${spanClass} group relative overflow-hidden rounded-2xl border border-border cursor-default ${
                  hasImage ? "" : `bg-gradient-to-br ${gradient}`
                }`}
              >
                {hasImage ? (
                  <div className="relative min-h-[220px]">
                    <img
                      src={space.image_url}
                      alt={space.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative flex flex-col justify-end h-full min-h-[220px] p-6">
                      <h3 className="font-bold text-white text-lg mb-1">{space.label}</h3>
                      <p className="text-sm text-white/80">{space.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-10 min-h-[180px] transition-transform duration-300 group-hover:scale-[1.03]">
                    <div className="w-14 h-14 rounded-2xl bg-card/80 border border-border flex items-center justify-center mb-4 shadow-sm">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{space.label}</h3>
                    <p className="text-sm text-muted-foreground">{space.description}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClinicGallerySection;
