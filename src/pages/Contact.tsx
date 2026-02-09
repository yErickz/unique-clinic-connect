import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/data/mockData";

const contactInfo = [
  { icon: MapPin, title: "Endereço", text: "Av. Paulista, 1000 - Bela Vista\nSão Paulo - SP, CEP 01310-100" },
  { icon: Phone, title: "Telefone", text: "(11) 9999-9999" },
  { icon: Mail, title: "E-mail", text: "contato@grupounique.com.br" },
  { icon: Clock, title: "Horários", text: "Segunda a Sexta: 7h às 19h\nSábado: 7h às 13h" },
];

const Contact = () => (
  <main className="pt-20 pb-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Central de Contato
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Entre em contato conosco. Estamos prontos para atendê-lo com todo o cuidado que você merece.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
        {contactInfo.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 card-shadow border border-border/50"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Map placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <div className="bg-secondary rounded-xl overflow-hidden h-64 flex items-center justify-center border border-border/50">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Mapa interativo — Google Maps</p>
            <p className="text-xs text-muted-foreground/60">Integração disponível com chave API</p>
          </div>
        </div>
      </motion.div>

      <div className="text-center">
        <a href={getWhatsAppLink("Olá! Gostaria de mais informações sobre o Grupo Unique.")}>
          <Button size="lg" className="hero-gradient border-0 text-primary-foreground">
            <Phone className="w-5 h-5 mr-2" /> Falar pelo WhatsApp
          </Button>
        </a>
      </div>
    </div>
  </main>
);

export default Contact;
