import { Link } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Doctor } from "@/data/mockData";

interface Props {
  doctor: Doctor;
  index: number;
}

const DoctorCard = ({ doctor, index }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <Link
      to={`/medico/${doctor.id}`}
      className="group flex items-center gap-4 bg-card rounded-2xl p-5 card-shadow hover:card-shadow-hover border border-border/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
        <User className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{doctor.name}</h4>
        <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{doctor.crm}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  </motion.div>
);

export default DoctorCard;
