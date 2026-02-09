import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-lg font-semibold mb-4">Grupo Unique</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Referência em saúde com atendimento humanizado e tecnologia de ponta.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider opacity-70">Navegação</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">Início</Link>
            <Link to="/contato" className="opacity-70 hover:opacity-100 transition-opacity">Contato</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider opacity-70">Contato</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-2 opacity-70">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP</span>
            </div>
            <div className="flex items-center gap-2 opacity-70">
              <Phone className="w-4 h-4 shrink-0" />
              <span>(11) 9999-9999</span>
            </div>
            <div className="flex items-center gap-2 opacity-70">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Seg–Sex: 7h–19h | Sáb: 7h–13h</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs opacity-50">
        © {new Date().getFullYear()} Grupo Unique. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
