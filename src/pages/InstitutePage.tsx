import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorCard from "@/components/DoctorCard";
import { institutes, doctors, getWhatsAppLink } from "@/data/mockData";

const InstitutePage = () => {
  const { id } = useParams();
  const institute = institutes.find((i) => i.id === id);
  const instituteDoctors = doctors.filter((d) => d.instituteId === id);

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Instituto não encontrado</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {institute.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-10">{institute.description}</p>
        </motion.div>

        {/* Serviços */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {institute.services.map((service) => (
              <div key={service} className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border/50 card-shadow">
                <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                <span className="text-sm font-medium text-foreground">{service}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Médicos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Corpo Clínico</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instituteDoctors.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center py-8">
          <a href={getWhatsAppLink(`Olá! Gostaria de agendar uma consulta no ${institute.name}.`)}>
            <Button size="lg" className="hero-gradient border-0 text-primary-foreground">
              <Phone className="w-5 h-5 mr-2" /> Agendar neste Instituto
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
};

export default InstitutePage;
