import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, User, Award, Stethoscope, GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doctors, institutes, getWhatsAppLink } from "@/data/mockData";

const DoctorProfile = () => {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);
  const institute = doctor ? institutes.find((i) => i.id === doctor.instituteId) : null;

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Médico não encontrado</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl overflow-hidden card-shadow border border-border"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary to-transparent p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 rounded-3xl bg-secondary border-4 border-card flex items-center justify-center shrink-0 shadow-lg">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {doctor.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                    <Stethoscope className="w-4 h-4" /> {doctor.specialty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" /> {doctor.crm}
                  </span>
                </div>
                {institute && (
                  <Link 
                    to={`/instituto/${institute.id}`} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {institute.name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Sobre o Profissional</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">{doctor.bio}</p>

            {/* CTA */}
            <div className="bg-secondary/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Agende sua Consulta</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Entre em contato pelo WhatsApp para agendar uma consulta com {doctor.name}.
              </p>
              <a href={getWhatsAppLink(`Olá! Gostaria de agendar uma consulta com ${doctor.name} (${doctor.specialty}).`)}>
                <Button size="lg" className="w-full md:w-auto hero-gradient border-0 text-primary-foreground rounded-full px-8">
                  <Phone className="w-5 h-5 mr-2" /> Agendar com {doctor.name}
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default DoctorProfile;
