import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star, MessageSquareQuote, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

const empty: Partial<TablesInsert<"testimonials">> = {
  quote: "", patient_initials: "", specialty: "", rating: 5, is_published: false,
};

const AdminTestimonials = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);

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
      closeDialog();
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

  const closeDialog = () => { setOpen(false); setEditing(null); setForm(empty); };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ quote: t.quote, patient_initials: t.patient_initials, specialty: t.specialty, rating: t.rating, is_published: t.is_published });
    setOpen(true);
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
        <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="hero-gradient border-0 text-primary-foreground gap-1.5">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Editar Depoimento" : "Novo Depoimento"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
              <div><Label>Depoimento</Label><Textarea value={form.quote ?? ""} onChange={(e) => set("quote", e.target.value)} required rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Iniciais do Paciente</Label><Input value={form.patient_initials ?? ""} onChange={(e) => set("patient_initials", e.target.value)} required placeholder="M.S." /></div>
                <div><Label>Especialidade</Label><Input value={form.specialty ?? ""} onChange={(e) => set("specialty", e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Avaliação (1-5)</Label>
                  <Input type="number" min={1} max={5} value={form.rating ?? 5} onChange={(e) => set("rating", parseInt(e.target.value))} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={!!form.is_published} onCheckedChange={(v) => set("is_published", v)} />
                  <Label>Publicado</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Salvando..." : "Salvar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-12 justify-center text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> Carregando...
        </div>
      ) : (
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card rounded-xl border border-border p-4 group hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-foreground">{t.patient_initials}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{t.specialty}</span>
                    {t.is_published ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        <Eye size={10} /> Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        <EyeOff size={10} /> Rascunho
                      </span>
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
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(t)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(t.id); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
