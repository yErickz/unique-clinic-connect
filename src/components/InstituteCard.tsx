import { Link } from "react-router-dom";
import { Heart, Bone, Sparkles, Eye, ArrowRight } from "lucide-react";
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
        className="group block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover border border-border/50 transition-all duration-300 hover:-translate-y-1"
      >
        <div className="w-12 h-12 rounded-lg hero-gradient flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">{institute.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{institute.description}</p>
        <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
          Ver especialidades <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </Link>
    </motion.div>
  );
};

export default InstituteCard;
