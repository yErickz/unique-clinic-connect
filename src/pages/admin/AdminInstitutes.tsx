import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Institute = Tables<"institutes">;

const empty: Partial<TablesInsert<"institutes">> = {
  name: "", slug: "", category: "", description: "", icon: "Heart", services: [],
};

/* ── Page content keys ── */
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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Institute | null>(null);
  const [form, setForm] = useState(empty);
  const [servicesText, setServicesText] = useState("");
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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Institutos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os institutos e os textos da página pública.</p>
        </div>
        <a
          href="/institutos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <ExternalLink size={16} />
          Visualizar Página
        </a>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">📋 Lista de Institutos</TabsTrigger>
          <TabsTrigger value="page">📝 Textos da Página</TabsTrigger>
        </TabsList>

        {/* ── Tab: Lista de Institutos ── */}
        <TabsContent value="list">
          <div className="flex justify-end mb-4">
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
        </TabsContent>

        {/* ── Tab: Textos da Página ── */}
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
    </div>
  );
};

export default AdminInstitutes;