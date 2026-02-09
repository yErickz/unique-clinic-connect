import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/data/mockData";

const contactInfo = [
  { icon: MapPin, title: "Endereço", text: "Av. Paulista, 1000 - Bela Vista\nSão Paulo - SP, CEP 01310-100" },
  { icon: Phone, title: "Telefone", text: "(11) 9999-9999" },
  { icon: Mail, title: "E-mail", text: "contato@grupounique.com.br" },
  { icon: Clock, title: "Horários", text: "Segunda a Sexta: 7h às 19h\nSábado: 7h às 13h" },
];

const Contact = () => (
  <main className="pt-32 pb-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Fale Conosco</span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          Central de Contato
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Estamos prontos para atendê-lo com todo o cuidado que você merece. Entre em contato conosco.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 card-shadow border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-secondary rounded-3xl overflow-hidden h-80 flex items-center justify-center border border-border">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Como chegar</h3>
              <p className="text-sm text-muted-foreground mb-4">Av. Paulista, 1000 - Bela Vista, São Paulo</p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Av+Paulista+1000+Sao+Paulo" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="rounded-full">
                  <MapPin className="w-4 h-4 mr-2" /> Abrir no Google Maps
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-primary rounded-3xl p-10 text-primary-foreground"
        >
          <h2 className="text-2xl font-bold mb-3">Prefere falar pelo WhatsApp?</h2>
          <p className="opacity-80 mb-6 max-w-md mx-auto">
            Nossa equipe está pronta para tirar suas dúvidas e agendar sua consulta.
          </p>
          <a href={getWhatsAppLink("Olá! Gostaria de mais informações sobre o Grupo Unique.")}>
            <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary font-semibold">
              <Phone className="w-5 h-5 mr-2" /> Falar pelo WhatsApp
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  </main>
);

export default Contact;
