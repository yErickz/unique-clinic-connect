import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Exam {
  name: string;
  price: string;
}

interface ExamsEditorProps {
  value: string;
  onChange: (jsonString: string) => void;
}

const ExamsEditor = ({ value, onChange }: ExamsEditorProps) => {
  let exams: Exam[] = [];
  try {
    exams = JSON.parse(value || "[]");
  } catch {
    exams = [];
  }

  const update = (updated: Exam[]) => onChange(JSON.stringify(updated));

  const updateField = (index: number, field: keyof Exam, val: string) => {
    const copy = [...exams];
    copy[index] = { ...copy[index], [field]: val };
    update(copy);
  };

  const remove = (index: number) => {
    update(exams.filter((_, i) => i !== index));
  };

  const add = () => {
    update([...exams, { name: "", price: "" }]);
  };

  return (
    <div className="space-y-3">
      {exams.map((exam, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex-1">
            {i === 0 && <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome</label>}
            <Input
              placeholder="Ex: Hemograma"
              value={exam.name}
              onChange={(e) => updateField(i, "name", e.target.value)}
            />
          </div>
          <div className="w-36">
            {i === 0 && <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço</label>}
            <Input
              placeholder="Ex: R$ 45,00"
              value={exam.price}
              onChange={(e) => updateField(i, "price", e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="shrink-0"
            onClick={() => remove(i)}
          >
            <Trash2 size={16} />
          </Button>
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
