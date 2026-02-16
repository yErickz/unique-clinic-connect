import { motion } from "framer-motion";
import { Users, Shield, Clock } from "lucide-react";

const stats = [
  { icon: Users, label: "Pacientes atendidos", value: "50.000+" },
  { icon: Shield, label: "Anos de experiência", value: "15+" },
  { icon: Clock, label: "Tempo médio de espera", value: "< 15min" },
];

const StatsSection = () => (
  <section className="py-16 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <stat.icon className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm opacity-80">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
