import { Link } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";
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
      className="group flex items-center gap-4 bg-card rounded-xl p-4 card-shadow hover:card-shadow-hover border border-border/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <User className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground">{doctor.name}</h4>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        <p className="text-xs text-muted-foreground/70">{doctor.crm}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </Link>
  </motion.div>
);

export default DoctorCard;
