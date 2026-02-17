import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
        <h1 className="text-2xl font-bold text-foreground">Médicos</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="hero-gradient border-0 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Médico" : "Novo Médico"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} required placeholder="dr-nome" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Especialidade</Label>
                  <Input value={form.specialty ?? ""} onChange={(e) => set("specialty", e.target.value)} required />
                </div>
                <div>
                  <Label>CRM</Label>
                  <Input value={form.crm ?? ""} onChange={(e) => set("crm", e.target.value)} required />
                </div>
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
              <div>
                <Label>Bio</Label>
                <Textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
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
                <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Especialidade</th>
                <th className="text-left p-3 font-medium text-muted-foreground">CRM</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-medium text-foreground">{doc.name}</td>
                  <td className="p-3 text-muted-foreground">{doc.specialty}</td>
                  <td className="p-3 text-muted-foreground">{doc.crm}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(doc)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm("Remover este médico?")) deleteMutation.mutate(doc.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default AdminDoctors;
