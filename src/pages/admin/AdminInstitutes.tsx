import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Save, ExternalLink, Upload, X, ImageIcon, Building2, LayoutList, Type } from "lucide-react";
import { toast } from "sonner";
import ImageCropDialog from "@/components/admin/ImageCropDialog";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Institute = Tables<"institutes">;

const empty: Partial<TablesInsert<"institutes">> = {
  name: "", slug: "", category: "", description: "", icon: "Heart", services: [],
};

const pageFields = [
  { key: "institutes_page_label", label: "Etiqueta", hint: "Ex: Especialidades" },
  { key: "institutes_page_title", label: "Título da Página" },
  { key: "institutes_page_subtitle", label: "Subtítulo" },
  { key: "institutes_page_cta_text", label: "Texto antes do botão CTA" },
  { key: "institutes_page_cta_button", label: "Texto do botão CTA" },
  { key: "institutes_page_cta_message", label: "Mensagem do WhatsApp", hint: "Mensagem enviada ao clicar no botão" },
];

const AdminInstitutes = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Institute | null>(null);
  const [form, setForm] = useState(empty);
  const [servicesText, setServicesText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [cropState, setCropState] = useState<{ imageSrc: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageDrafts, setPageDrafts] = useState<Record<string, string>>({});
  const [pageEditing, setPageEditing] = useState(false);

  const { data: institutes = [], isLoading } = useQuery({
    queryKey: ["admin-institutes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("institutes").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: pageContent = [] } = useQuery({
    queryKey: ["admin-institutes-page-content"],
    queryFn: async () => {
      const keys = pageFields.map((f) => f.key);
      const { data, error } = await supabase.from("site_content").select("*").in("key", keys);
      if (error) throw error;
      return data;
    },
  });

  const contentByKey = new Map(pageContent.map((c) => [c.key, c]));

  const saveMutation = useMutation({
    mutationFn: async (d: Partial<TablesInsert<"institutes">>) => {
      const payload = {
        ...d,
        services: servicesText.split(",").map((s) => s.trim()).filter(Boolean),
        image_url: imageUrl || null,
      };
      if (editing) {
        const { error } = await supabase.from("institutes").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("institutes").insert(payload as TablesInsert<"institutes">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-institutes"] });
      qc.invalidateQueries({ queryKey: ["admin-institute-count"] });
      qc.invalidateQueries({ queryKey: ["public-institutes"] });
      toast.success(editing ? "Instituto atualizado!" : "Instituto adicionado!");
      closeForm();
    },
    onError: () => toast.error("Erro ao salvar instituto."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const inst = institutes.find((i) => i.id === id);
      if (inst?.image_url) {
        const path = inst.image_url.split("/gallery/")[1];
        if (path) await supabase.storage.from("gallery").remove([path]);
      }
      const { error } = await supabase.from("institutes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-institutes"] });
      qc.invalidateQueries({ queryKey: ["admin-institute-count"] });
      toast.success("Instituto removido!");
    },
  });

  const savePageMutation = useMutation({
    mutationFn: async (items: { id: string; value: string }[]) => {
      for (const item of items) {
        const { error } = await supabase.from("site_content").update({ value: item.value }).eq("id", item.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-institutes-page-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Textos da página atualizados!");
      setPageEditing(false);
      setPageDrafts({});
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(empty);
    setServicesText("");
    setImageUrl("");
  };

  const openEdit = (inst: Institute) => {
    setEditing(inst);
    setForm({ name: inst.name, slug: inst.slug, category: inst.category, description: inst.description, icon: inst.icon });
    setServicesText(inst.services.join(", "));
    setImageUrl(inst.image_url || "");
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setServicesText("");
    setImageUrl("");
    setShowForm(true);
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropState({ imageSrc: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropConfirm = useCallback(async (croppedBlob: Blob) => {
    setCropState(null);
    setIsUploading(true);
    try {
      if (imageUrl) {
        const oldPath = imageUrl.split("/gallery/")[1];
        if (oldPath) await supabase.storage.from("gallery").remove([oldPath]);
      }
      const fileName = `institutes/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, croppedBlob, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);
      setImageUrl(publicUrl);
      toast.success("Foto enviada!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + (err.message || "Tente novamente"));
    } finally {
      setIsUploading(false);
    }
  }, [imageUrl]);

  const removeImage = async () => {
    if (imageUrl) {
      const path = imageUrl.split("/gallery/")[1];
      if (path) await supabase.storage.from("gallery").remove([path]);
    }
    setImageUrl("");
  };

  const startPageEditing = () => {
    const initial: Record<string, string> = {};
    pageFields.forEach((f) => {
      const item = contentByKey.get(f.key);
      if (item) initial[f.key] = item.value;
    });
    setPageDrafts(initial);
    setPageEditing(true);
  };

  const handleSavePage = () => {
    const updates = pageFields
      .map((f) => {
        const item = contentByKey.get(f.key);
        if (!item) return null;
        const newValue = pageDrafts[f.key];
        if (newValue === undefined || newValue === item.value) return null;
        return { id: item.id, value: newValue };
      })
      .filter(Boolean) as { id: string; value: string }[];
    if (updates.length === 0) {
      toast.info("Nenhuma alteração detectada.");
      return;
    }
    savePageMutation.mutate(updates);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <Building2 className="w-[18px] h-[18px] text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Institutos</h1>
            <p className="text-xs text-muted-foreground">{institutes.length} cadastrados</p>
          </div>
        </div>
        <a
          href="/institutos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ExternalLink size={14} />
          Ver página
        </a>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="gap-1.5"><LayoutList size={14} /> Lista de Institutos</TabsTrigger>
          <TabsTrigger value="page" className="gap-1.5"><Type size={14} /> Textos da Página</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {/* Add button */}
          {!showForm && (
            <div className="flex justify-end mb-4">
              <Button className="hero-gradient border-0 text-primary-foreground" onClick={openNew}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>
          )}

          {/* Inline Form */}
          {showForm && (
            <div className="bg-card rounded-xl border border-accent/30 p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">{editing ? "Editar Instituto" : "Novo Instituto"}</h2>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={closeForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
                {/* Image upload */}
                <div>
                  <Label className="mb-2 block">Foto de Capa</Label>
                  {imageUrl ? (
                    <div className="relative inline-block">
                      <img src={imageUrl} alt="Capa" className="w-full h-40 rounded-lg object-cover border border-border" />
                      <button
                        type="button"
                        onClick={removeImage}
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
                      className="w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      ) : (
                        <>
                          <Upload size={20} />
                          <span className="text-xs">Clique para enviar uma foto</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  {imageUrl && (
                    <Button type="button" variant="outline" size="sm" className="mt-2 gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <Upload size={14} />
                      {isUploading ? "Enviando..." : "Trocar foto"}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Nome</Label><Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required /></div>
                  <div><Label>Slug</Label><Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} required placeholder="cardiologia" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Categoria</Label><Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
                  <div><Label>Ícone</Label><Input value={form.icon ?? "Heart"} onChange={(e) => set("icon", e.target.value)} placeholder="Heart" /></div>
                </div>
                <div><Label>Descrição</Label><Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} /></div>
                <div><Label>Serviços (separados por vírgula)</Label><Input value={servicesText} onChange={(e) => setServicesText(e.target.value)} placeholder="Exame 1, Exame 2" /></div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={closeForm}>Cancelar</Button>
                  <Button type="submit" size="sm" disabled={saveMutation.isPending || isUploading} className="gap-1.5">
                    <Save size={14} />
                    {saveMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {institutes.map((inst) => (
                <div key={inst.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between group hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {inst.image_url ? (
                      <img src={inst.image_url} alt={inst.name} className="w-12 h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ImageIcon size={14} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground">{inst.name}</p>
                      <p className="text-xs text-muted-foreground">{inst.category} · {inst.services.length} serviços</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(inst)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(inst.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Textos da Página */}
        <TabsContent value="page">
          <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Textos da Página de Institutos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Edite os textos exibidos na página pública /institutos</p>
              </div>
              {!pageEditing && (
                <Button size="sm" variant="outline" onClick={startPageEditing} className="gap-1.5">
                  <Pencil size={14} /> Editar
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {pageFields.map((field) => {
                const item = contentByKey.get(field.key);
                if (!item && !pageEditing) return null;
                const value = pageEditing ? (pageDrafts[field.key] ?? item?.value ?? "") : (item?.value ?? "");

                return (
                  <div key={field.key}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <label className="text-sm font-medium text-foreground">{field.label}</label>
                      {field.hint && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{field.hint}</span>
                      )}
                    </div>
                    {pageEditing ? (
                      field.key.includes("subtitle") || field.key.includes("message") ? (
                        <Textarea
                          value={value}
                          onChange={(e) => setPageDrafts((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          rows={2}
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) => setPageDrafts((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        />
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">{value || "—"}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {pageEditing && (
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => { setPageEditing(false); setPageDrafts({}); }}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSavePage} disabled={savePageMutation.isPending} className="gap-1.5">
                  <Save size={14} />
                  {savePageMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Crop Dialog - keeping this as it's not a modal form, it's a utility */}
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

export default AdminInstitutes;
