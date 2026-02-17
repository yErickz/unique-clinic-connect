import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Doctor = Tables<"doctors">;

const emptyDoctor: Partial<TablesInsert<"doctors">> = {
  name: "", slug: "", specialty: "", crm: "", bio: "", institute_id: null,
};

const AdminDoctors = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState(emptyDoctor);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: institutes = [] } = useQuery({
    queryKey: ["admin-institutes-list"],
    queryFn: async () => {
      const { data } = await supabase.from("institutes").select("id, name").order("display_order");
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (d: Partial<TablesInsert<"doctors">>) => {
      if (editing) {
        const { error } = await supabase.from("doctors").update(d).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("doctors").insert(d as TablesInsert<"doctors">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-doctors"] });
      qc.invalidateQueries({ queryKey: ["admin-doctor-count"] });
      toast.success(editing ? "Médico atualizado!" : "Médico adicionado!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao salvar médico."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("doctors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-doctors"] });
      qc.invalidateQueries({ queryKey: ["admin-doctor-count"] });
      toast.success("Médico removido!");
    },
  });

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyDoctor);
  };

  const openEdit = (doc: Doctor) => {
    setEditing(doc);
    setForm({ name: doc.name, slug: doc.slug, specialty: doc.specialty, crm: doc.crm, bio: doc.bio, institute_id: doc.institute_id });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const set = (key: string, val: string | null) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Médicos</h1>
            <p className="text-xs text-muted-foreground">{doctors.length} cadastrados</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground border-0 gap-1.5">
              <Plus className="w-4 h-4" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Médico" : "Novo Médico"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nome</Label><Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required /></div>
                <div><Label>Slug</Label><Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} required placeholder="dr-nome" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Especialidade</Label><Input value={form.specialty ?? ""} onChange={(e) => set("specialty", e.target.value)} required /></div>
                <div><Label>CRM</Label><Input value={form.crm ?? ""} onChange={(e) => set("crm", e.target.value)} required /></div>
              </div>
              <div>
                <Label>Instituto</Label>
                <Select value={form.institute_id ?? "none"} onValueChange={(v) => set("institute_id", v === "none" ? null : v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {institutes.map((i) => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Bio</Label><Textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} rows={3} /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Salvando..." : "Salvar"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 py-12 justify-center text-muted-foreground">
          <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
          Carregando...
        </div>
      ) : (
        <div className="space-y-2">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-card rounded-xl border border-border/60 p-4 flex items-center justify-between hover:border-border transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {doc.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{doc.specialty}</span>
                    <span className="text-xs text-muted-foreground/40">•</span>
                    <span className="text-xs text-muted-foreground">CRM {doc.crm}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(doc)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover este médico?")) deleteMutation.mutate(doc.id); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
