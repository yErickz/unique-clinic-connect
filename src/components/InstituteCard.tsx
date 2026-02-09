import { Link } from "react-router-dom";
import { Heart, Bone, Sparkles, Eye, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Institute } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  Heart, Bone, Sparkles, Eye,
};

interface Props {
  institute: Institute;
  index: number;
}

const InstituteCard = ({ institute, index }: Props) => {
  const Icon = iconMap[institute.icon] || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/instituto/${institute.id}`}
        className="group block bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover border border-border/50 transition-all duration-300 hover:-translate-y-1 h-full"
      >
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
          <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2">{institute.name}</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2">{institute.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {institute.services.slice(0, 3).map((service) => (
            <span key={service} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
              {service}
            </span>
          ))}
          {institute.services.length > 3 && (
            <span className="text-xs text-muted-foreground px-2.5 py-1">
              +{institute.services.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center text-primary text-sm font-medium">
          Ver especialidades 
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};

export default InstituteCard;
