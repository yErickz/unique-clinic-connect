import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorCard from "@/components/DoctorCard";
import { institutes, doctors, getWhatsAppLink } from "@/data/mockData";

const InstitutePage = () => {
  const { id } = useParams();
  const institute = institutes.find((i) => i.id === id);
  const instituteDoctors = doctors.filter((d) => d.instituteId === id);

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Instituto não encontrado</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar para Início
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Instituto</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                {institute.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">{institute.description}</p>
            </motion.div>

            {/* Serviços */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-xl font-semibold text-foreground mb-5">Serviços e Exames</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {institute.services.map((service) => (
                  <div key={service} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
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
            >
              <h2 className="text-xl font-semibold text-foreground mb-5">Corpo Clínico</h2>
              <div className="grid grid-cols-1 gap-4">
                {instituteDoctors.map((doc, i) => (
                  <DoctorCard key={doc.id} doctor={doc} index={i} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-32 bg-card rounded-2xl p-6 card-shadow border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Agende sua Consulta</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Entre em contato pelo WhatsApp e agende sua consulta com os especialistas do {institute.name}.
              </p>
              <a href={getWhatsAppLink(`Olá! Gostaria de agendar uma consulta no ${institute.name}.`)} className="block">
                <Button className="w-full hero-gradient border-0 text-primary-foreground rounded-full">
                  <Phone className="w-4 h-4 mr-2" /> Agendar pelo WhatsApp
                </Button>
              </a>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Atendimento de Seg–Sex: 7h–19h
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstitutePage;
