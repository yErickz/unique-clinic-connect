import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  index: number;
}

const ServiceCard = ({ id, category, title, description, image, index }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
  >
    <Link
      to={`/instituto/${id}`}
      className="group flex gap-5 bg-card rounded-2xl p-4 card-shadow hover:card-shadow-hover border border-border/50 hover:border-accent/30 transition-all duration-300"
    >
      <div className="w-40 h-32 md:w-48 md:h-36 rounded-xl overflow-hidden shrink-0">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col justify-center py-1 min-w-0">
        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
          {category}
        </span>
        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>
        <span className="inline-flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
          Saiba mais <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-2 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  </motion.div>
);

export default ServiceCard;
