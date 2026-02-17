import { Input } from "@/components/ui/input";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const ICON_OPTIONS = [
  { value: "Building2", label: "Prédio" },
  { value: "Stethoscope", label: "Estetoscópio" },
  { value: "TestTube", label: "Tubo de Ensaio" },
  { value: "Armchair", label: "Poltrona" },
  { value: "Monitor", label: "Monitor" },
  { value: "Heart", label: "Coração" },
  { value: "Activity", label: "Atividade" },
  { value: "Baby", label: "Bebê" },
  { value: "Bed", label: "Cama" },
  { value: "Pill", label: "Pílula" },
];

const SPAN_OPTIONS = [
  { value: "normal", label: "Normal (1 coluna)" },
  { value: "wide", label: "Largo (2 colunas)" },
];

interface GallerySpace {
  icon: string;
  label: string;
  description: string;
  span: string;
}

interface GalleryEditorProps {
  value: string;
  onChange: (jsonString: string) => void;
}

/* ── Sortable Item ── */
interface SortableSpaceProps {
  id: string;
  space: GallerySpace;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateField: (field: keyof GallerySpace, val: string) => void;
  onRemove: () => void;
}

const SortableSpaceItem = ({ id, space, isExpanded, onToggle, onUpdateField, onRemove }: SortableSpaceProps) => {
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{space.label || "Novo espaço"}</span>
            <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded shrink-0">
              {space.span === "wide" ? "2 colunas" : "1 coluna"}
            </span>
          </div>
          {space.description && (
            <span className="text-xs text-muted-foreground truncate block mt-0.5">{space.description}</span>
          )}
        </div>
        <button type="button" className="p-1 text-muted-foreground cursor-pointer" onClick={onToggle}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome</label>
              <Input
                placeholder="Ex: Recepção"
                value={space.label}
                onChange={(e) => onUpdateField("label", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Ícone</label>
              <Select value={space.icon} onValueChange={(val) => onUpdateField("icon", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição</label>
            <Input
              placeholder="Ex: Ambiente amplo e acolhedor"
              value={space.description}
              onChange={(e) => onUpdateField("description", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Largura</label>
            <Select value={space.span || "normal"} onValueChange={(val) => onUpdateField("span", val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
const GalleryEditor = ({ value, onChange }: GalleryEditorProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  let spaces: GallerySpace[] = [];
  try { spaces = JSON.parse(value || "[]"); } catch { spaces = []; }

  const spaceIds = spaces.map((_, i) => `space-${i}`);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const update = (updated: GallerySpace[]) => onChange(JSON.stringify(updated));

  const updateField = (index: number, field: keyof GallerySpace, val: string) => {
    const copy = [...spaces];
    copy[index] = { ...copy[index], [field]: val };
    update(copy);
  };

  const remove = (index: number) => {
    if (expandedIndex === index) setExpandedIndex(null);
    update(spaces.filter((_, i) => i !== index));
  };

  const add = () => {
    update([...spaces, { icon: "Building2", label: "", description: "", span: "normal" }]);
    setExpandedIndex(spaces.length);
  };

  const toggle = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = spaceIds.indexOf(active.id as string);
    const newIndex = spaceIds.indexOf(over.id as string);
    const reordered = arrayMove(spaces, oldIndex, newIndex);
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
        <SortableContext items={spaceIds} strategy={verticalListSortingStrategy}>
          {spaces.map((space, i) => (
            <SortableSpaceItem
              key={spaceIds[i]}
              id={spaceIds[i]}
              space={space}
              isExpanded={expandedIndex === i}
              onToggle={() => toggle(i)}
              onUpdateField={(field, val) => updateField(i, field, val)}
              onRemove={() => remove(i)}
            />
          ))}
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeId ? (() => {
            const idx = spaceIds.indexOf(activeId);
            const space = spaces[idx];
            if (!space) return null;
            return (
              <div className="border-2 border-primary rounded-lg bg-card shadow-xl px-3 py-2.5 flex items-center gap-2 opacity-95">
                <GripVertical size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground truncate">{space.label || "Novo espaço"}</span>
              </div>
            );
          })() : null}
        </DragOverlay>
      </DndContext>

      <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={add}>
        <Plus size={14} />
        Adicionar Espaço
      </Button>
    </div>
  );
};

export default GalleryEditor;
