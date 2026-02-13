import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import logoLight from "@/assets/logo-unique-light.jpg";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={logoLight} 
              alt="Clínica Unique" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="text-sm opacity-70 leading-relaxed mb-6">
            Saúde, bem-estar e day clinic. Referência em atendimento humanizado e tecnologia de última geração.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider">Navegação</h4>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Início</Link>
            <Link to="/#institutos" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Nossos Institutos</Link>
            <Link to="/#convenios" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Convênios</Link>
            <Link to="/contato" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Contato</Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider">Institutos</h4>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/instituto/cardiologia" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Cardiologia</Link>
            <Link to="/instituto/ortopedia" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Ortopedia</Link>
            <Link to="/instituto/dermatologia" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Dermatologia</Link>
            <Link to="/instituto/oftalmologia" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">Oftalmologia</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm mb-5 uppercase tracking-wider">Contato</h4>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-start gap-3 opacity-70">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>Av. Paulista, 1000<br />Bela Vista, São Paulo - SP</span>
            </div>
            <div className="flex items-center gap-3 opacity-70">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <span>(11) 9999-9999</span>
            </div>
            <div className="flex items-center gap-3 opacity-70">
              <Mail className="w-4 h-4 shrink-0 text-primary" />
              <span>contato@grupounique.com.br</span>
            </div>
            <div className="flex items-start gap-3 opacity-70">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>Seg–Sex: 7h–19h<br />Sáb: 7h–13h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-background/10">
      <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <span>© {new Date().getFullYear()} Clínica Unique. Todos os direitos reservados.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:opacity-100">Política de Privacidade</a>
          <a href="#" className="hover:opacity-100">Termos de Uso</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
