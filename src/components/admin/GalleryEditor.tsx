import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp, GripVertical, Upload, ImageIcon, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageCropDialog from "@/components/admin/ImageCropDialog";
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

interface GallerySpace {
  label: string;
  description: string;
  image_url?: string;
  span: string;
}

interface GalleryEditorProps {
  value: string;
  onChange: (jsonString: string) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/* ── Sortable Item ── */
interface SortableSpaceProps {
  id: string;
  space: GallerySpace;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateField: (field: keyof GallerySpace, val: string) => void;
  onRemove: () => void;
  onSelectFile: (file: File) => void;
  onRemoveImage: () => void;
  isUploading: boolean;
}

const SortableSpaceItem = ({
  id, space, isExpanded, onToggle, onUpdateField, onRemove,
  onSelectFile, onRemoveImage, isUploading,
}: SortableSpaceProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
      e.target.value = "";
    }
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
        <div className="flex-1 min-w-0 cursor-pointer px-2 flex items-center gap-3" onClick={onToggle}>
          {space.image_url ? (
            <img src={space.image_url} alt={space.label} className="w-10 h-10 rounded object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
              <ImageIcon size={16} className="text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">{space.label || "Novo espaço"}</span>
              <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded shrink-0">
                {space.span === "wide" ? "2 col" : space.span === "vertical" ? "2 row" : "1 col"}
              </span>
            </div>
            {space.description && (
              <span className="text-xs text-muted-foreground truncate block mt-0.5">{space.description}</span>
            )}
          </div>
        </div>
        <button type="button" className="p-1 text-muted-foreground cursor-pointer" onClick={onToggle}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
          {/* Image upload */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Foto</label>
            {space.image_url ? (
              <div className="relative inline-block">
                <img src={space.image_url} alt={space.label} className="w-full max-w-xs h-40 rounded-lg object-cover border border-border" />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full max-w-xs h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                ) : (
                  <>
                    <Upload size={20} />
                    <span className="text-xs">Clique para enviar</span>
                  </>
                )}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {space.image_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 gap-1.5"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload size={14} />
                {isUploading ? "Enviando..." : "Trocar foto"}
              </Button>
            )}
          </div>

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
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Largura</label>
              <select
                value={space.span || "normal"}
                onChange={(e) => onUpdateField("span", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="normal">Normal (1 coluna)</option>
                <option value="wide">Largo (2 colunas)</option>
                <option value="vertical">Vertical (2 linhas)</option>
              </select>
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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [cropState, setCropState] = useState<{ index: number; imageSrc: string } | null>(null);

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

  const handleSelectFile = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({ index, imageSrc: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = useCallback(async (croppedBlob: Blob) => {
    if (!cropState) return;
    const { index } = cropState;
    setCropState(null);
    setUploadingIndex(index);
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, croppedBlob, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);

      const copy = [...spaces];
      copy[index] = { ...copy[index], image_url: publicUrl };
      update(copy);
      toast.success("Foto enviada!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + (err.message || "Tente novamente"));
    } finally {
      setUploadingIndex(null);
    }
  }, [cropState, spaces, update]);

  const removeImage = async (index: number) => {
    const space = spaces[index];
    if (space.image_url) {
      // Try to delete from storage
      const path = space.image_url.split("/gallery/")[1];
      if (path) {
        await supabase.storage.from("gallery").remove([path]);
      }
    }
    const copy = [...spaces];
    copy[index] = { ...copy[index], image_url: "" };
    update(copy);
  };

  const remove = (index: number) => {
    if (expandedIndex === index) setExpandedIndex(null);
    // Clean up image from storage
    const space = spaces[index];
    if (space.image_url) {
      const path = space.image_url.split("/gallery/")[1];
      if (path) supabase.storage.from("gallery").remove([path]);
    }
    update(spaces.filter((_, i) => i !== index));
  };

  const add = () => {
    update([...spaces, { label: "", description: "", image_url: "", span: "normal" }]);
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
    update(arrayMove(spaces, oldIndex, newIndex));

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
              onSelectFile={(file) => handleSelectFile(i, file)}
              onRemoveImage={() => removeImage(i)}
              isUploading={uploadingIndex === i}
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
                {space.image_url && <img src={space.image_url} alt="" className="w-8 h-8 rounded object-cover" />}
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

      {/* Crop Dialog */}
      <ImageCropDialog
        open={!!cropState}
        imageSrc={cropState?.imageSrc ?? ""}
        aspect={16 / 9}
        onClose={() => setCropState(null)}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
};

export default GalleryEditor;
