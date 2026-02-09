import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getWhatsAppLink } from "@/data/mockData";

const WhatsAppButton = () => (
  <motion.a
    href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta no Grupo Unique.")}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-whatsapp hover:bg-whatsapp-hover text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label="Fale conosco pelo WhatsApp"
  >
    <MessageCircle className="w-7 h-7" />
  </motion.a>
);

export default WhatsAppButton;
