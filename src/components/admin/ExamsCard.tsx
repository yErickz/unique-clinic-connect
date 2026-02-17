import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ChevronDown, ChevronUp, Save } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Exam {
  name: string;
  price: string;
  description?: string;
  category?: string;
  convenio?: boolean;
}

interface ExamsCardProps {
  contentId: string;
  title: string;
  titleContentId: string;
  value: string;
}

const formatCurrency = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  const formatted = (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatted;
};

const ExamsCard = ({ contentId, title, titleContentId, value }: ExamsCardProps) => {
  const qc = useQueryClient();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState(title);

  let initialExams: Exam[] = [];
  try {
    initialExams = JSON.parse(value || "[]");
  } catch {
    initialExams = [];
  }

  const [exams, setExams] = useState<Exam[]>(initialExams);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = [
        { id: contentId, value: JSON.stringify(exams) },
        ...(draftTitle !== title ? [{ id: titleContentId, value: draftTitle }] : []),
      ];
      for (const item of updates) {
        const { error } = await supabase.from("site_content").update({ value: item.value }).eq("id", item.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Exames salvos com sucesso!");
    },
    onError: () => toast.error("Erro ao salvar. Tente novamente."),
  });

  const updateField = (index: number, field: keyof Exam, val: string | boolean) => {
    const copy = [...exams];
    copy[index] = { ...copy[index], [field]: val };
    setExams(copy);
  };

  const handlePriceChange = (index: number, raw: string) => {
    updateField(index, "price", formatCurrency(raw));
  };

  const remove = (index: number) => {
    if (expandedIndex === index) setExpandedIndex(null);
    setExams(exams.filter((_, i) => i !== index));
  };

  const add = () => {
    setExams([...exams, { name: "", price: "", description: "", category: "", convenio: false }]);
    setExpandedIndex(exams.length);
  };

  const toggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const categories = [...new Set(exams.map((e) => e.category).filter(Boolean))];

  return (
    <div className="bg-card rounded-xl border border-border p-5 col-span-1 md:col-span-2">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧪</span>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Exames</h3>
            <p className="text-xs text-muted-foreground">Gerencie os exames disponíveis na clínica</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {exams.length} {exams.length === 1 ? "exame" : "exames"}
          </span>
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-1.5">
            <Save size={14} />
            {saveMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Title field */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Título da seção</label>
        <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((cat) => (
            <span key={cat} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {cat} ({exams.filter((e) => e.category === cat).length})
            </span>
          ))}
        </div>
      )}

      {/* Exam list */}
      <div className="space-y-2 mb-3">
        {exams.map((exam, i) => (
          <div key={i} className="border border-border rounded-lg bg-muted/30 overflow-hidden">
            <div
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggle(i)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {exam.name || "Novo exame"}
                  </span>
                  {exam.category && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                      {exam.category}
                    </span>
                  )}
                  {exam.convenio && (
                    <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded shrink-0">
                      Convênio
                    </span>
                  )}
                </div>
                {exam.price && <span className="text-xs text-muted-foreground">{exam.price}</span>}
              </div>
              {expandedIndex === i ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
            </div>

            {expandedIndex === i && (
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome</label>
                    <Input
                      placeholder="Ex: Hemograma"
                      value={exam.name}
                      onChange={(e) => updateField(i, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço</label>
                    <Input
                      placeholder="R$ 0,00"
                      value={exam.price}
                      onChange={(e) => handlePriceChange(i, e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Categoria</label>
                  <Input
                    placeholder="Ex: Sangue, Imagem, Urina..."
                    value={exam.category || ""}
                    onChange={(e) => updateField(i, "category", e.target.value)}
                    list="exam-categories"
                  />
                  {categories.length > 0 && (
                    <datalist id="exam-categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição / Observação</label>
                  <Textarea
                    placeholder="Ex: Necessário jejum de 8 horas"
                    value={exam.description || ""}
                    onChange={(e) => updateField(i, "description", e.target.value)}
                    rows={2}
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={exam.convenio ?? false}
                      onCheckedChange={(checked) => updateField(i, "convenio", checked)}
                    />
                    <label className="text-xs text-muted-foreground">Aceita convênio</label>
                  </div>
                  <Button type="button" variant="destructive" size="sm" className="gap-1.5" onClick={() => remove(i)}>
                    <Trash2 size={14} />
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={add}>
        <Plus size={14} />
        Adicionar Exame
      </Button>
    </div>
  );
};

export default ExamsCard;
