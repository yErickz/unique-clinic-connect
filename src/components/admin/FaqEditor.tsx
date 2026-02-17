import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Faq {
  question: string;
  answer: string;
}

interface FaqEditorProps {
  value: string;
  onChange: (jsonString: string) => void;
}

/* ── Sortable FAQ Item ── */
interface SortableFaqProps {
  id: string;
  faq: Faq;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateField: (field: keyof Faq, val: string) => void;
  onRemove: () => void;
}

const SortableFaqItem = ({ id, faq, isExpanded, onToggle, onUpdateField, onRemove }: SortableFaqProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg overflow-hidden transition-all ${
        isDragging ? "border-primary/50 bg-primary/5 opacity-30 shadow-none" : "border-border bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-1 px-1 py-2.5 hover:bg-muted/50 transition-colors">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <div className="flex-1 min-w-0 cursor-pointer px-2" onClick={onToggle}>
          <span className="text-sm font-medium text-foreground truncate block">
            {faq.question || "Nova pergunta"}
          </span>
          {!isExpanded && faq.answer && (
            <span className="text-xs text-muted-foreground truncate block mt-0.5">
              {faq.answer.length > 80 ? faq.answer.slice(0, 80) + "…" : faq.answer}
            </span>
          )}
        </div>
        <button type="button" className="p-1 text-muted-foreground cursor-pointer" onClick={onToggle}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Pergunta</label>
            <Input
              placeholder="Ex: Como faço para agendar uma consulta?"
              value={faq.question}
              onChange={(e) => onUpdateField("question", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Resposta</label>
            <Textarea
              placeholder="Digite a resposta..."
              value={faq.answer}
              onChange={(e) => onUpdateField("answer", e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="destructive" size="sm" className="gap-1.5" onClick={onRemove}>
              <Trash2 size={14} />
              Remover
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Editor ── */
const FaqEditor = ({ value, onChange }: FaqEditorProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  let faqs: Faq[] = [];
  try { faqs = JSON.parse(value || "[]"); } catch { faqs = []; }

  const faqIds = faqs.map((_, i) => `faq-${i}`);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const update = (updated: Faq[]) => onChange(JSON.stringify(updated));

  const updateField = (index: number, field: keyof Faq, val: string) => {
    const copy = [...faqs];
    copy[index] = { ...copy[index], [field]: val };
    update(copy);
  };

  const remove = (index: number) => {
    if (expandedIndex === index) setExpandedIndex(null);
    update(faqs.filter((_, i) => i !== index));
  };

  const add = () => {
    update([...faqs, { question: "", answer: "" }]);
    setExpandedIndex(faqs.length);
  };

  const toggle = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = faqIds.indexOf(active.id as string);
    const newIndex = faqIds.indexOf(over.id as string);
    const reordered = arrayMove(faqs, oldIndex, newIndex);
    update(reordered);

    if (expandedIndex === oldIndex) {
      setExpandedIndex(newIndex);
    } else if (expandedIndex !== null) {
      if (oldIndex < expandedIndex && newIndex >= expandedIndex) {
        setExpandedIndex(expandedIndex - 1);
      } else if (oldIndex > expandedIndex && newIndex <= expandedIndex) {
        setExpandedIndex(expandedIndex + 1);
      }
    }
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={faqIds} strategy={verticalListSortingStrategy}>
          {faqs.map((faq, i) => (
            <SortableFaqItem
              key={faqIds[i]}
              id={faqIds[i]}
              faq={faq}
              isExpanded={expandedIndex === i}
              onToggle={() => toggle(i)}
              onUpdateField={(field, val) => updateField(i, field, val)}
              onRemove={() => remove(i)}
            />
          ))}
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeId ? (() => {
            const idx = faqIds.indexOf(activeId);
            const faq = faqs[idx];
            if (!faq) return null;
            return (
              <div className="border-2 border-primary rounded-lg bg-card shadow-xl px-3 py-2.5 flex items-center gap-2 opacity-95">
                <GripVertical size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground truncate">{faq.question || "Nova pergunta"}</span>
              </div>
            );
          })() : null}
        </DragOverlay>
      </DndContext>

      <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={add}>
        <Plus size={14} />
        Adicionar Pergunta
      </Button>
    </div>
  );
};

export default FaqEditor;
