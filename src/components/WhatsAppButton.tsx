import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getWhatsAppLink } from "@/data/mockData";

const WhatsAppButton = () => (
  <motion.a
    href={getWhatsAppLink("Olá! Gostaria de agendar uma consulta na Clínica Unique.")}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors pulse-ring"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.12 }}
    whileTap={{ scale: 0.92 }}
    aria-label="Fale conosco pelo WhatsApp"
  >
    <MessageCircle className="w-7 h-7" />
  </motion.a>
);

export default WhatsAppButton;