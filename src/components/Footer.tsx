import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import logoLight from "@/assets/logo-unique-light.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const Footer = () => {
  const { c } = useSiteContent();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoLight} alt="Clínica Unique" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-6">
              {c("footer_description", "Saúde, bem-estar e day clinic. Referência em atendimento humanizado e tecnologia de última geração.")}
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider">Navegação</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { to: "/", label: "Início" },
                { to: "/institutos", label: "Institutos" },
                { to: "/medicos", label: "Médicos" },
                { to: "/contato", label: "Contato" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="opacity-70 hover:opacity-100 hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider">Institutos</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { to: "/instituto/cardiologia", label: "Cardiologia" },
                { to: "/instituto/ortopedia", label: "Ortopedia" },
                { to: "/instituto/dermatologia", label: "Dermatologia" },
                { to: "/instituto/oftalmologia", label: "Oftalmologia" },
                { to: "/instituto/ginecologia", label: "Ginecologia" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="opacity-70 hover:opacity-100 hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider">Contato</h4>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-start gap-3 opacity-70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="whitespace-pre-line">{c("contact_address", "Av. Pará, 1136, Térreo\nCentro, Tucumã - PA")}</span>
              </div>
              <div className="flex items-center gap-3 opacity-70">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>{c("contact_phone", "(94) 99277-5857")}</span>
              </div>
              <div className="flex items-center gap-3 opacity-70">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span>{c("contact_email", "contato@grupounique.com.br")}</span>
              </div>
              <div className="flex items-start gap-3 opacity-70">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>{c("contact_hours", "Seg–Sex: 8h–18h")}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="border-t border-background/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-50">
          <span>© {new Date().getFullYear()} {c("footer_copyright", "Clínica Unique. Todos os direitos reservados.")}</span>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:opacity-100 transition-opacity">Política de Privacidade</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Termos de Uso</a>
            <Link to="/admin/login" className="hover:opacity-100 transition-opacity">Painel</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
