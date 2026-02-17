import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Save, Info, Image as ImageIcon, Type, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import GalleryEditor from "@/components/admin/GalleryEditor";

const GALLERY_KEYS = ["gallery_label", "gallery_title", "gallery_subtitle", "gallery_data"];

const keyLabels: Record<string, { label: string; hint?: string }> = {
  gallery_label: { label: "Etiqueta", hint: "Ex: Nossa Estrutura" },
  gallery_title: { label: "Título" },
  gallery_subtitle: { label: "Subtítulo" },
  gallery_data: { label: "Espaços da galeria" },
};

const AdminGallery = () => {
  const qc = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["admin-gallery-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .in("key", GALLERY_KEYS);
      if (error) throw error;
      return data;
    },
  });

  const contentByKey = new Map(contents.map((c) => [c.key, c]));

  // Initialize drafts once data loads
  if (!initialized && contents.length > 0) {
    const initial: Record<string, string> = {};
    GALLERY_KEYS.forEach((k) => {
      const item = contentByKey.get(k);
      if (item) initial[k] = item.value;
    });
    setDrafts(initial);
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async (items: { id: string; value: string }[]) => {
      for (const item of items) {
        const { error } = await supabase.from("site_content").update({ value: item.value }).eq("id", item.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Galeria salva com sucesso!");
    },
    onError: () => toast.error("Erro ao salvar. Tente novamente."),
  });

  const handleSave = () => {
    const updates = GALLERY_KEYS
      .map((k) => {
        const item = contentByKey.get(k);
        if (!item) return null;
        const newValue = drafts[k];
        if (newValue === undefined || newValue === item.value) return null;
        return { id: item.id, value: newValue };
      })
      .filter(Boolean) as { id: string; value: string }[];

    if (updates.length === 0) {
      toast.info("Nenhuma alteração detectada.");
      return;
    }
    saveMutation.mutate(updates);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <ImageIcon className="w-[18px] h-[18px] text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Galeria de Fotos</h1>
            <p className="text-xs text-muted-foreground">Gerencie os espaços da galeria</p>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ExternalLink size={14} />
          Ver site
        </a>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-3 text-muted-foreground">Carregando...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Title fields */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Type size={14} className="text-muted-foreground" />
              Textos da Seção
            </h2>
            {GALLERY_KEYS.filter((k) => k !== "gallery_data").map((k) => {
              const item = contentByKey.get(k);
              if (!item) return null;
              const kl = keyLabels[k];
              return (
                <div key={k}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-sm font-medium text-foreground">{kl?.label ?? k}</label>
                    {kl?.hint && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        <Info size={12} />
                        {kl.hint}
                      </span>
                    )}
                  </div>
                  <Input
                    value={drafts[k] ?? item.value}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [k]: e.target.value }))}
                  />
                </div>
              );
            })}
          </div>

          {/* Gallery spaces editor */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <LayoutGrid size={14} className="text-muted-foreground" />
              Espaços da Galeria
            </h2>
            <GalleryEditor
              value={drafts["gallery_data"] ?? contentByKey.get("gallery_data")?.value ?? "[]"}
              onChange={(val) => setDrafts((prev) => ({ ...prev, gallery_data: val }))}
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-1.5">
              <Save size={14} />
              {saveMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
