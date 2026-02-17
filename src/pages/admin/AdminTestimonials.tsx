import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Depoimentos</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="hero-gradient border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>
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

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Paciente</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Depoimento</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Nota</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Publicado</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-medium text-foreground">{t.patient_initials}</td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">{t.quote}</td>
                  <td className="p-3">
                    <div className="flex">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />)}</div>
                  </td>
                  <td className="p-3 text-center">
                    <Switch checked={t.is_published} onCheckedChange={(v) => togglePublish.mutate({ id: t.id, published: v })} />
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(t.id); }}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
