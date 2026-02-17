import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Users, X, Save, LayoutGrid, LayoutList, Stethoscope, BadgeCheck, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { ExpandableAdminCard } from "@/components/admin/ExpandableAdminCard";
import ImageCropDialog from "@/components/admin/ImageCropDialog";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Doctor = Tables<"doctors">;

const emptyDoctor: Partial<TablesInsert<"doctors">> = {
  name: "", specialty: "", crm: "", bio: "",
};

const AdminDoctors = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState(emptyDoctor);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [cropState, setCropState] = useState<{ imageSrc: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: doctorInstituteLinks = [] } = useQuery({
    queryKey: ["admin-doctor-institutes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctor_institutes").select("doctor_id, institute_id");
      if (error) throw error;
      return data as { doctor_id: string; institute_id: string }[];
    },
  });

  const { data: institutes = [] } = useQuery({
    queryKey: ["admin-institutes-list"],
    queryFn: async () => {
      const { data } = await supabase.from("institutes").select("id, name").order("display_order");
      return data ?? [];
    },
  });

  const generateSlug = (name: string) =>
    name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const saveMutation = useMutation({
    mutationFn: async (d: Partial<TablesInsert<"doctors">>) => {
      const payload = { ...d, slug: generateSlug(d.name || ""), photo_url: photoUrl || null };
      if (editing) {
        const { error } = await supabase.from("doctors").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("doctors").insert(payload as TablesInsert<"doctors">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-doctors"] });
      qc.invalidateQueries({ queryKey: ["admin-doctor-count"] });
      toast.success(editing ? "Médico atualizado!" : "Médico adicionado!");
      closeForm();
    },
    onError: () => toast.error("Erro ao salvar médico."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const doc = doctors.find((d) => d.id === id);
      if (doc?.photo_url) {
        const path = doc.photo_url.split("/gallery/")[1];
        if (path) await supabase.storage.from("gallery").remove([path]);
      }
      const { error } = await supabase.from("doctors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-doctors"] });
      qc.invalidateQueries({ queryKey: ["admin-doctor-count"] });
      toast.success("Médico removido!");
    },
  });

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyDoctor); setPhotoUrl(""); };

  const openEdit = (doc: Doctor) => {
    setEditing(doc);
    setForm({ name: doc.name, specialty: doc.specialty, crm: doc.crm, bio: doc.bio });
    setPhotoUrl(doc.photo_url || "");
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyDoctor);
    setPhotoUrl("");
    setShowForm(true);
  };

  const set = (key: string, val: string | null) => setForm((f) => ({ ...f, [key]: val }));

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
      if (photoUrl) {
        const oldPath = photoUrl.split("/gallery/")[1];
        if (oldPath) await supabase.storage.from("gallery").remove([oldPath]);
      }
      const fileName = `doctors/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, croppedBlob, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);
      setPhotoUrl(publicUrl);
      toast.success("Foto enviada!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + (err.message || "Tente novamente"));
    } finally {
      setIsUploading(false);
    }
  }, [photoUrl]);

  const removePhoto = async () => {
    if (photoUrl) {
      const path = photoUrl.split("/gallery/")[1];
      if (path) await supabase.storage.from("gallery").remove([path]);
    }
    setPhotoUrl("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users className="w-[18px] h-[18px] text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Médicos</h1>
            <p className="text-xs text-muted-foreground">{doctors.length} cadastrados</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          {!showForm && (
            <Button size="sm" className="hero-gradient border-0 text-primary-foreground gap-1.5" onClick={openNew}>
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          )}
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-card rounded-xl border border-accent/30 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">{editing ? "Editar Médico" : "Novo Médico"}</h2>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={closeForm}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            {/* Photo upload */}
            <div>
              <Label className="mb-2 block">Foto do Médico</Label>
              <div className="flex items-center gap-4">
                {photoUrl ? (
                  <div className="relative">
                    <img src={photoUrl} alt="Foto" className="w-20 h-20 rounded-xl object-cover border border-border" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                    ) : (
                      <>
                        <User size={18} />
                        <span className="text-[10px]">Foto</span>
                      </>
                    )}
                  </button>
                )}
                <div className="flex-1">
                  <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <Upload size={14} />
                    {isUploading ? "Enviando..." : photoUrl ? "Trocar foto" : "Enviar foto"}
                  </Button>
                  <p className="text-[11px] text-muted-foreground mt-1">Recomendado: foto quadrada, mínimo 200×200px</p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Nome</Label><Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required /></div>
              <div><Label>Especialidade</Label><Input value={form.specialty ?? ""} onChange={(e) => set("specialty", e.target.value)} required /></div>
            </div>
            <div>
              <Label>CRM</Label>
              <Input value={form.crm ?? ""} onChange={(e) => set("crm", e.target.value)} required />
            </div>
            <div><Label>Bio</Label><Textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} rows={3} placeholder="Formação, experiência e especializações do médico" /></div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={closeForm}>Cancelar</Button>
              <Button type="submit" size="sm" disabled={saveMutation.isPending || isUploading} className="gap-1.5">
                <Save className="w-3.5 h-3.5" />
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Crop dialog */}
      {cropState && (
        <ImageCropDialog
          open={!!cropState}
          imageSrc={cropState.imageSrc}
          onConfirm={handleCropConfirm}
          onClose={() => setCropState(null)}
          aspect={1}
        />
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-12 justify-center text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> Carregando...
        </div>
      ) : viewMode === "list" ? (
          <div className="space-y-2">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between group hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {doc.photo_url ? (
                    <img src={doc.photo_url} alt={doc.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-border" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {doc.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty} · CRM {doc.crm}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(doc)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover este médico?")) deleteMutation.mutate(doc.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {doctors.map((doc) => {
              const docInstitutes = doctorInstituteLinks
                .filter((l) => l.doctor_id === doc.id)
                .map((l) => institutes.find((i) => i.id === l.institute_id))
                .filter(Boolean);
              return (
                <ExpandableAdminCard
                  key={doc.id}
                  actions={
                    <>
                      <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => openEdit(doc)}><Pencil className="w-3 h-3" /> Editar</Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover este médico?")) deleteMutation.mutate(doc.id); }}><Trash2 className="w-3 h-3" /> Excluir</Button>
                    </>
                  }
                  expandedContent={
                    <div className="p-3 space-y-2">
                      {doc.bio && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{doc.bio}</p>}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BadgeCheck size={12} className="text-accent" />
                        <span>CRM {doc.crm}</span>
                      </div>
                      {docInstitutes.map((inst: any) => (
                        <div key={inst.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Stethoscope size={12} className="text-accent" />
                          <span>{inst.name}</span>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <div className="p-4 pb-6 text-center">
                    {doc.photo_url ? (
                      <img src={doc.photo_url} alt={doc.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-border" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground mx-auto mb-3">
                        {doc.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <p className="font-semibold text-sm text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.specialty}</p>
                  </div>
                </ExpandableAdminCard>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default AdminDoctors;
