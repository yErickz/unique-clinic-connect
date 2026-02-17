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

type Content = Tables<"site_content">;

const AdminContent = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Content | null>(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("site_content").update({ value }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_content").insert({ key, value } as TablesInsert<"site_content">);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success("Salvo!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success("Removido!");
    },
  });

  const closeDialog = () => { setOpen(false); setEditing(null); setKey(""); setValue(""); };

  const openEdit = (c: Content) => {
    setEditing(c);
    setKey(c.key);
    setValue(c.value);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Conteúdo do Site</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="hero-gradient border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar Conteúdo" : "Novo Conteúdo"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div>
                <Label>Chave</Label>
                <Input value={key} onChange={(e) => setKey(e.target.value)} required disabled={!!editing} placeholder="hero_title" />
              </div>
              <div>
                <Label>Valor</Label>
                <Textarea value={value} onChange={(e) => setValue(e.target.value)} required rows={4} />
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
      ) : contents.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 bg-card rounded-2xl border border-border">
          <p>Nenhum conteúdo cadastrado ainda.</p>
          <p className="text-sm mt-1">Use o botão "Adicionar" para criar chaves de conteúdo editável.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Chave</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Valor</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-mono text-xs text-foreground">{c.key}</td>
                  <td className="p-3 text-muted-foreground max-w-md truncate">{c.value}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) deleteMutation.mutate(c.id); }}><Trash2 className="w-4 h-4" /></Button>
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

export default AdminContent;
