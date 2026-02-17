import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Exam {
  name: string;
  price: string;
  description?: string;
  category?: string;
  convenio?: boolean;
}

interface ExamsEditorProps {
  value: string;
  onChange: (jsonString: string) => void;
}

const formatCurrency = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const ExamsEditor = ({ value, onChange }: ExamsEditorProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  let exams: Exam[] = [];
  try { exams = JSON.parse(value || "[]"); } catch { exams = []; }

  const update = (updated: Exam[]) => onChange(JSON.stringify(updated));

  const updateField = (index: number, field: keyof Exam, val: string | boolean) => {
    const copy = [...exams];
    copy[index] = { ...copy[index], [field]: val };
    update(copy);
  };

  const handlePriceChange = (index: number, raw: string) => {
    updateField(index, "price", formatCurrency(raw));
  };

  const remove = (index: number) => {
    if (expandedIndex === index) setExpandedIndex(null);
    update(exams.filter((_, i) => i !== index));
  };

  const add = () => {
    update([...exams, { name: "", price: "", description: "", category: "", convenio: false }]);
    setExpandedIndex(exams.length);
  };

  const toggle = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const categories = [...new Set(exams.map((e) => e.category).filter(Boolean))];

  return (
    <div className="space-y-2">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {categories.map((cat) => (
            <span key={cat} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {cat} ({exams.filter((e) => e.category === cat).length})
            </span>
          ))}
        </div>
      )}

      {exams.map((exam, i) => (
        <div key={i} className="border border-border rounded-lg bg-muted/30 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggle(i)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">{exam.name || "Novo exame"}</span>
                {exam.category && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">{exam.category}</span>}
                {exam.convenio && <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded shrink-0">Convênio</span>}
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
                  <Input placeholder="Ex: Hemograma" value={exam.name} onChange={(e) => updateField(i, "name", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço</label>
                  <Input placeholder="R$ 0,00" value={exam.price} onChange={(e) => handlePriceChange(i, e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Categoria</label>
                <Input placeholder="Ex: Sangue, Imagem, Urina..." value={exam.category || ""} onChange={(e) => updateField(i, "category", e.target.value)} list="exam-categories" />
                {categories.length > 0 && (
                  <datalist id="exam-categories">
                    {categories.map((cat) => <option key={cat} value={cat} />)}
                  </datalist>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição / Observação</label>
                <Textarea placeholder="Ex: Necessário jejum de 8 horas" value={exam.description || ""} onChange={(e) => updateField(i, "description", e.target.value)} rows={2} className="text-xs" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={exam.convenio ?? false} onCheckedChange={(checked) => updateField(i, "convenio", checked)} />
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

      <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={add}>
        <Plus size={14} />
        Adicionar Exame
      </Button>
    </div>
  );
};

export default ExamsEditor;
