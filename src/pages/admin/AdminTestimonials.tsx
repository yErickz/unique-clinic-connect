import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star, MessageSquareQuote, Eye, EyeOff, X, Save, LayoutGrid, LayoutList, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ExpandableAdminCard } from "@/components/admin/ExpandableAdminCard";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

const empty: Partial<TablesInsert<"testimonials">> = {
  quote: "", patient_initials: "", specialty: "", rating: 5, is_published: false,
};

const AdminTestimonials = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (d: Partial<TablesInsert<"testimonials">>) => {
      if (editing) {
        const { error } = await supabase.from("testimonials").update(d).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(d as TablesInsert<"testimonials">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["admin-testimonial-count"] });
      toast.success(editing ? "Depoimento atualizado!" : "Depoimento adicionado!");
      closeForm();
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["admin-testimonial-count"] });
      toast.success("Depoimento removido!");
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ is_published: published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Status atualizado!");
    },
  });

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ quote: t.quote, patient_initials: t.patient_initials, specialty: t.specialty, rating: t.rating, is_published: t.is_published });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const published = testimonials.filter((t) => t.is_published).length;
  const draft = testimonials.length - published;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <MessageSquareQuote className="w-[18px] h-[18px] text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Depoimentos</h1>
            <p className="text-xs text-muted-foreground">{published} publicados · {draft} rascunhos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary rounded-lg p-0.5">
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutList size={16} />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
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
            <h2 className="text-sm font-semibold text-foreground">{editing ? "Editar Depoimento" : "Novo Depoimento"}</h2>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={closeForm}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div><Label>Depoimento</Label><Textarea value={form.quote ?? ""} onChange={(e) => set("quote", e.target.value)} required rows={3} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Iniciais do Paciente</Label><Input value={form.patient_initials ?? ""} onChange={(e) => set("patient_initials", e.target.value)} required placeholder="M.S." /></div>
              <div><Label>Especialidade</Label><Input value={form.specialty ?? ""} onChange={(e) => set("specialty", e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Avaliação (1-5)</Label>
                <Input type="number" min={1} max={5} value={form.rating ?? 5} onChange={(e) => set("rating", parseInt(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={!!form.is_published} onCheckedChange={(v) => set("is_published", v)} />
                <Label>Publicado</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={closeForm}>Cancelar</Button>
              <Button type="submit" size="sm" disabled={saveMutation.isPending} className="gap-1.5">
                <Save className="w-3.5 h-3.5" />
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-12 justify-center text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> Carregando...
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card rounded-xl border border-border p-4 group hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-foreground">{t.patient_initials}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{t.specialty}</span>
                    {t.is_published ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full"><Eye size={10} /> Publicado</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"><EyeOff size={10} /> Rascunho</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-accent text-accent" : "text-border"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => togglePublish.mutate({ id: t.id, published: !t.is_published })}>
                    {t.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(t)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(t.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {testimonials.map((t) => (
            <ExpandableAdminCard
              key={t.id}
              actions={
                <>
                  <Button size="icon" variant="ghost" className="h-7 w-7 bg-card/80 backdrop-blur-sm" onClick={() => togglePublish.mutate({ id: t.id, published: !t.is_published })}>
                    {t.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 bg-card/80 backdrop-blur-sm" onClick={() => openEdit(t)}><Pencil className="w-3 h-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 bg-card/80 backdrop-blur-sm text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(t.id); }}><Trash2 className="w-3 h-3" /></Button>
                </>
              }
              expandedContent={
                <div className="p-3 space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar size={12} className="text-accent" />
                    <span>{new Date(t.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              }
            >
              <div className="p-4 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm text-foreground">{t.patient_initials}</span>
                  {t.is_published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-full"><Eye size={9} /></span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full"><EyeOff size={9} /></span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-accent text-accent" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{t.specialty}</span>
                </div>
              </div>
            </ExpandableAdminCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
