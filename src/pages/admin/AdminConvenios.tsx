import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Save, Plus, Trash2, Upload, X, Shield } from "lucide-react";
import { toast } from "sonner";
import ImageCropDialog from "@/components/admin/ImageCropDialog";

interface Convenio {
  name: string;
  logo_url: string;
}

const CONTENT_KEY = "convenios_data";

const AdminConvenios = () => {
  const qc = useQueryClient();
  const [drafts, setDrafts] = useState<Convenio[] | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [cropState, setCropState] = useState<{ index: number; imageSrc: string } | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const { data: content, isLoading } = useQuery({
    queryKey: ["admin-convenios-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", CONTENT_KEY)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const convenios: Convenio[] = drafts ?? (() => {
    try { return content ? JSON.parse(content.value) : []; } catch { return []; }
  })();

  const update = (updated: Convenio[]) => setDrafts(updated);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!content) return;
      const { error } = await supabase
        .from("site_content")
        .update({ value: JSON.stringify(convenios) })
        .eq("id", content.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-convenios-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Convênios salvos com sucesso!");
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const addConvenio = () => update([...convenios, { name: "", logo_url: "" }]);

  const removeConvenio = async (index: number) => {
    const conv = convenios[index];
    if (conv.logo_url) {
      const path = conv.logo_url.split("/convenios/")[1];
      if (path) await supabase.storage.from("convenios").remove([path]);
    }
    update(convenios.filter((_, i) => i !== index));
  };

  const handleFileSelect = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => setCropState({ index, imageSrc: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async (croppedBlob: Blob) => {
    if (!cropState) return;
    const { index } = cropState;
    setCropState(null);
    setUploadingIndex(index);
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
      const { error: uploadError } = await supabase.storage
        .from("convenios")
        .upload(fileName, croppedBlob, { cacheControl: "3600", upsert: false, contentType: "image/png" });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("convenios").getPublicUrl(fileName);

      const copy = [...convenios];
      copy[index] = { ...copy[index], logo_url: publicUrl };
      update(copy);
      toast.success("Logo enviado!");
    } catch (err: any) {
      toast.error("Erro ao enviar: " + (err.message || "Tente novamente"));
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeLogo = async (index: number) => {
    const conv = convenios[index];
    if (conv.logo_url) {
      const path = conv.logo_url.split("/convenios/")[1];
      if (path) await supabase.storage.from("convenios").remove([path]);
    }
    const copy = [...convenios];
    copy[index] = { ...copy[index], logo_url: "" };
    update(copy);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield className="w-[18px] h-[18px] text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Convênios</h1>
            <p className="text-xs text-muted-foreground">Gerencie os convênios aceitos</p>
          </div>
        </div>
        <a
          href="/#convenios"
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
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h2 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Shield size={14} className="text-muted-foreground" />
              Convênios Aceitos
            </h2>

            {convenios.map((conv, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                {/* Logo */}
                <div className="shrink-0">
                  {conv.logo_url ? (
                    <div className="relative">
                      <img src={conv.logo_url} alt={conv.name} className="w-16 h-16 object-contain rounded-lg border border-border bg-white p-1" />
                      <button
                        type="button"
                        onClick={() => removeLogo(i)}
                        className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-destructive text-destructive-foreground shadow"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRefs.current[i]?.click()}
                      disabled={uploadingIndex === i}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors bg-white"
                    >
                      {uploadingIndex === i ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                      ) : (
                        <Upload size={18} />
                      )}
                    </button>
                  )}
                  <input
                    ref={(el) => { fileRefs.current[i] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { handleFileSelect(i, file); e.target.value = ""; }
                    }}
                  />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Nome do convênio"
                    value={conv.name}
                    onChange={(e) => {
                      const copy = [...convenios];
                      copy[i] = { ...copy[i], name: e.target.value };
                      update(copy);
                    }}
                  />
                </div>

                {/* Change logo button */}
                {conv.logo_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1 shrink-0"
                    onClick={() => fileRefs.current[i]?.click()}
                    disabled={uploadingIndex === i}
                  >
                    <Upload size={12} />
                    Trocar
                  </Button>
                )}

                {/* Remove */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="shrink-0"
                  onClick={() => removeConvenio(i)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={addConvenio}>
              <Plus size={14} />
              Adicionar Convênio
            </Button>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-1.5">
              <Save size={14} />
              {saveMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      )}

      {/* Crop Dialog */}
      <ImageCropDialog
        open={!!cropState}
        imageSrc={cropState?.imageSrc ?? ""}
        aspect={1}
        onClose={() => setCropState(null)}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
};

export default AdminConvenios;
