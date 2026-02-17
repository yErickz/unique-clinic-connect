import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Institute = Tables<"institutes">;

const empty: Partial<TablesInsert<"institutes">> = {
  name: "", slug: "", category: "", description: "", icon: "Heart", services: [],
};

const AdminInstitutes = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Institute | null>(null);
  const [form, setForm] = useState(empty);
  const [servicesText, setServicesText] = useState("");

  const { data: institutes = [], isLoading } = useQuery({
    queryKey: ["admin-institutes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("institutes").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (d: Partial<TablesInsert<"institutes">>) => {
      const payload = { ...d, services: servicesText.split(",").map((s) => s.trim()).filter(Boolean) };
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
      toast.success(editing ? "Instituto atualizado!" : "Instituto adicionado!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao salvar instituto."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("institutes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-institutes"] });
      qc.invalidateQueries({ queryKey: ["admin-institute-count"] });
      toast.success("Instituto removido!");
    },
  });

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(empty);
    setServicesText("");
  };

  const openEdit = (inst: Institute) => {
    setEditing(inst);
    setForm({ name: inst.name, slug: inst.slug, category: inst.category, description: inst.description, icon: inst.icon });
    setServicesText(inst.services.join(", "));
    setOpen(true);
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Institutos</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="hero-gradient border-0 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Instituto" : "Novo Instituto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nome</Label><Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required /></div>
                <div><Label>Slug</Label><Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} required placeholder="cardiologia" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Categoria</Label><Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
                <div><Label>Ícone</Label><Input value={form.icon ?? "Heart"} onChange={(e) => set("icon", e.target.value)} placeholder="Heart" /></div>
              </div>
              <div><Label>Descrição</Label><Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} /></div>
              <div><Label>Serviços (separados por vírgula)</Label><Input value={servicesText} onChange={(e) => setServicesText(e.target.value)} placeholder="Exame 1, Exame 2" /></div>
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
                <th className="text-left p-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Serviços</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {institutes.map((inst) => (
                <tr key={inst.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-medium text-foreground">{inst.name}</td>
                  <td className="p-3 text-muted-foreground">{inst.category}</td>
                  <td className="p-3 text-muted-foreground">{inst.services.length}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(inst)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(inst.id); }}><Trash2 className="w-4 h-4" /></Button>
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

export default AdminInstitutes;
