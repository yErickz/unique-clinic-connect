import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, User, Award, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { doctors, institutes, getWhatsAppLink } from "@/data/mockData";

const DoctorProfile = () => {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);
  const institute = doctor ? institutes.find((i) => i.id === doctor.instituteId) : null;

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Médico não encontrado</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to={institute ? `/instituto/${institute.id}` : "/"}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> {institute ? institute.name : "Voltar"}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 md:p-10 card-shadow border border-border/50"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="w-28 h-28 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
              <User className="w-14 h-14 text-muted-foreground" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                {doctor.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                  <Stethoscope className="w-4 h-4" /> {doctor.specialty}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" /> {doctor.crm}
                </span>
              </div>
              {institute && (
                <Link to={`/instituto/${institute.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {institute.name}
                </Link>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Sobre</h2>
            <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
          </div>

          <div className="text-center">
            <a href={getWhatsAppLink(`Olá! Gostaria de agendar uma consulta com ${doctor.name} (${doctor.specialty}).`)}>
              <Button size="lg" className="hero-gradient border-0 text-primary-foreground">
                <Phone className="w-5 h-5 mr-2" /> Agendar com {doctor.name.split(" ")[0]}. {doctor.name.split(" ").slice(-1)}
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default DoctorProfile;
