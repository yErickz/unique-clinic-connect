import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como faço para agendar uma consulta?",
    answer:
      "Você pode agendar sua consulta pelo WhatsApp clicando no botão de agendamento em nosso site, ou ligando diretamente para a clínica. Também aceitamos agendamentos presenciais na recepção.",
  },
  {
    question: "Quais convênios são aceitos?",
    answer:
      "Aceitamos os principais planos de saúde do Brasil, incluindo Amil, Bradesco Saúde, SulAmérica, Unimed, Porto Seguro, NotreDame Intermédica, Hapvida, Prevent Senior, entre outros. Consulte a lista completa na seção de convênios.",
  },
  {
    question: "Qual o horário de funcionamento da clínica?",
    answer:
      "Funcionamos de segunda a sexta-feira das 7h às 19h e aos sábados das 7h às 13h. O laboratório abre a partir das 6h30 para coleta de exames em jejum.",
  },
  {
    question: "Preciso de encaminhamento para consultar um especialista?",
    answer:
      "Não é necessário encaminhamento para consultas particulares. Para atendimentos por convênio, verifique as regras do seu plano — alguns exigem guia de referência do médico assistente.",
  },
  {
    question: "Como funciona o atendimento domiciliar?",
    answer:
      "Nosso serviço domiciliar inclui coleta de exames, vacinas e curativos no conforto da sua casa. Basta entrar em contato pelo WhatsApp para verificar disponibilidade e agendar a visita.",
  },
  {
    question: "Em quanto tempo recebo os resultados dos exames?",
    answer:
      "A maioria dos exames laboratoriais tem resultado em até 24 horas úteis. Exames mais complexos podem levar de 3 a 7 dias. Você receberá os resultados por e-mail ou poderá retirá-los na clínica.",
  },
];

const FaqSection = () => (
  <section id="faq" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">
          Tire suas dúvidas
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          Perguntas Frequentes
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Reunimos as principais dúvidas dos nossos pacientes para facilitar o
          seu atendimento.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            >
              <AccordionItem
                value={`faq-${i}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-all duration-300 hover:border-primary/30"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FaqSection;
