import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Content = Tables<"site_content">;

const sections: Record<string, { label: string; keys: string[] }> = {
  hero: { label: "🏠 Hero", keys: ["hero_badge", "hero_title", "hero_subtitle", "hero_cta_primary", "hero_cta_secondary", "hero_stat_1", "hero_stat_2", "hero_stat_3", "hero_float_title", "hero_float_subtitle", "hero_float_badge"] },
  about: { label: "ℹ️ Sobre", keys: ["about_label", "about_title", "about_text_1", "about_text_2", "about_mission", "about_vision", "about_values", "about_stat_1_value", "about_stat_1_label", "about_stat_2_value", "about_stat_2_label", "about_stat_3_value", "about_stat_3_label", "about_stat_4_value", "about_stat_4_label"] },
  services: { label: "🩺 Especialidades", keys: ["services_label", "services_title", "services_subtitle"] },
  exams: { label: "🧪 Exames", keys: ["exams_title", "exams_data"] },
  convenios: { label: "🏥 Convênios", keys: ["convenios_label", "convenios_title", "convenios_subtitle", "convenios_list"] },
  contact: { label: "📍 Contato", keys: ["contact_label", "contact_title", "contact_address", "contact_phone", "contact_hours", "contact_email"] },
  cta: { label: "📢 CTA Final", keys: ["cta_title", "cta_subtitle", "cta_button"] },
  faq: { label: "❓ FAQ", keys: ["faq_label", "faq_title", "faq_subtitle", "faq_data"] },
  gallery: { label: "🖼️ Galeria", keys: ["gallery_label", "gallery_title", "gallery_subtitle"] },
  footer: { label: "📄 Rodapé", keys: ["footer_description", "footer_copyright"] },
  contact_page: { label: "📞 Página Contato", keys: ["contact_page_label", "contact_page_title", "contact_page_subtitle", "contact_page_cta_title", "contact_page_cta_subtitle"] },
  general: { label: "⚙️ Geral", keys: ["whatsapp_number", "header_brand_name"] },
};

const keyLabels: Record<string, string> = {
  hero_badge: "Badge do hero", hero_title: "Título principal", hero_subtitle: "Subtítulo", hero_cta_primary: "Botão principal", hero_cta_secondary: "Botão secundário",
  hero_stat_1: "Destaque 1", hero_stat_2: "Destaque 2", hero_stat_3: "Destaque 3", hero_float_title: "Card flutuante título", hero_float_subtitle: "Card flutuante subtítulo", hero_float_badge: "Badge flutuante",
  about_label: "Label", about_title: "Título", about_text_1: "Parágrafo 1", about_text_2: "Parágrafo 2", about_mission: "Missão", about_vision: "Visão", about_values: "Valores",
  about_stat_1_value: "Stat 1 valor", about_stat_1_label: "Stat 1 label", about_stat_2_value: "Stat 2 valor", about_stat_2_label: "Stat 2 label",
  about_stat_3_value: "Stat 3 valor", about_stat_3_label: "Stat 3 label", about_stat_4_value: "Stat 4 valor", about_stat_4_label: "Stat 4 label",
  services_label: "Label", services_title: "Título", services_subtitle: "Subtítulo",
  exams_title: "Título", exams_data: "Dados dos exames (JSON)",
  convenios_label: "Label", convenios_title: "Título", convenios_subtitle: "Subtítulo", convenios_list: "Lista (separada por vírgula)",
  contact_label: "Label", contact_title: "Título", contact_address: "Endereço", contact_phone: "Telefone", contact_hours: "Horários", contact_email: "E-mail",
  cta_title: "Título", cta_subtitle: "Subtítulo", cta_button: "Texto do botão",
  faq_label: "Label", faq_title: "Título", faq_subtitle: "Subtítulo", faq_data: "Perguntas e respostas (JSON)",
  gallery_label: "Label", gallery_title: "Título", gallery_subtitle: "Subtítulo",
  footer_description: "Descrição", footer_copyright: "Copyright",
  contact_page_label: "Label", contact_page_title: "Título", contact_page_subtitle: "Subtítulo", contact_page_cta_title: "CTA Título", contact_page_cta_subtitle: "CTA Subtítulo",
  whatsapp_number: "Número do WhatsApp (com DDI)", header_brand_name: "Nome no cabeçalho",
};

const AdminContent = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase.from("site_content").update({ value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Conteúdo atualizado!");
      setEditingId(null);
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const contentByKey = new Map(contents.map((c) => [c.key, c]));

  const filteredSections = Object.entries(sections).filter(([, sec]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return sec.label.toLowerCase().includes(q) || sec.keys.some((k) => {
      const item = contentByKey.get(k);
      return k.includes(q) || (keyLabels[k] ?? "").toLowerCase().includes(q) || (item?.value ?? "").toLowerCase().includes(q);
    });
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Conteúdo do Site</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conteúdo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-6">
          {filteredSections.map(([sectionKey, sec]) => {
            const sectionItems = sec.keys.map((k) => contentByKey.get(k)).filter(Boolean) as Content[];
            if (sectionItems.length === 0) return null;

            return (
              <div key={sectionKey} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="bg-secondary/50 px-4 py-3 border-b border-border">
                  <h2 className="font-semibold text-foreground text-sm">{sec.label}</h2>
                </div>
                <div className="divide-y divide-border">
                  {sectionItems.map((item) => {
                    const isEditing = editingId === item.id;
                    const isLong = item.value.length > 80 || item.key.includes("data") || item.key.includes("text_");

                    return (
                      <div key={item.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              {keyLabels[item.key] ?? item.key}
                              <span className="ml-2 text-xs font-mono opacity-50">{item.key}</span>
                            </p>
                            {isEditing ? (
                              <div className="space-y-2">
                                {isLong ? (
                                  <Textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows={item.key.includes("data") ? 8 : 3}
                                    className="font-mono text-xs"
                                  />
                                ) : (
                                  <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                )}
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => saveMutation.mutate({ id: item.id, value: editValue })} disabled={saveMutation.isPending}>
                                    {saveMutation.isPending ? "Salvando..." : "Salvar"}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-foreground truncate max-w-2xl">{item.value}</p>
                            )}
                          </div>
                          {!isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => { setEditingId(item.id); setEditValue(item.value); }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminContent;
