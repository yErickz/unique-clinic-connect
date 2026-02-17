import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, ExternalLink, Save, X, Info, Search, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import ExamsEditor from "@/components/admin/ExamsEditor";
import FaqEditor from "@/components/admin/FaqEditor";

type Content = Tables<"site_content">;

/* ── Section metadata ── */
const sections: Record<string, { label: string; icon: string; description: string; keys: string[] }> = {
  hero: { label: "Banner Principal", icon: "🏠", description: "Textos e destaques do topo do site", keys: ["hero_badge", "hero_title", "hero_subtitle", "hero_cta_primary", "hero_cta_secondary", "hero_stat_1", "hero_stat_2", "hero_stat_3", "hero_float_title", "hero_float_subtitle", "hero_float_badge"] },
  about: { label: "Sobre Nós", icon: "ℹ️", description: "Missão, visão, valores e estatísticas", keys: ["about_label", "about_title", "about_text_1", "about_text_2", "about_mission", "about_vision", "about_values", "about_stat_1_value", "about_stat_1_label", "about_stat_2_value", "about_stat_2_label", "about_stat_3_value", "about_stat_3_label", "about_stat_4_value", "about_stat_4_label"] },
  services: { label: "Especialidades", icon: "🩺", description: "Títulos da seção de especialidades", keys: ["services_label", "services_title", "services_subtitle"] },
  exams: { label: "Exames", icon: "🧪", description: "Lista de exames disponíveis", keys: ["exams_title", "exams_data"] },
  convenios: { label: "Convênios", icon: "🏥", description: "Convênios aceitos pela clínica", keys: ["convenios_label", "convenios_title", "convenios_subtitle", "convenios_list"] },
  contact: { label: "Contato (Página Inicial)", icon: "📍", description: "Endereço, telefone e horário", keys: ["contact_label", "contact_title", "contact_address", "contact_phone", "contact_hours", "contact_email"] },
  cta: { label: "Chamada para Ação", icon: "📢", description: "Seção que convida a agendar consulta", keys: ["cta_title", "cta_subtitle", "cta_button"] },
  faq: { label: "Perguntas Frequentes", icon: "❓", description: "Perguntas e respostas do site", keys: ["faq_label", "faq_title", "faq_subtitle", "faq_data"] },
  gallery: { label: "Galeria de Fotos", icon: "🖼️", description: "Títulos da seção de fotos", keys: ["gallery_label", "gallery_title", "gallery_subtitle"] },
  footer: { label: "Rodapé", icon: "📄", description: "Textos do rodapé do site", keys: ["footer_description", "footer_copyright"] },
  contact_page: { label: "Página de Contato", icon: "📞", description: "Textos da página dedicada de contato", keys: ["contact_page_label", "contact_page_title", "contact_page_subtitle", "contact_page_cta_title", "contact_page_cta_subtitle"] },
  general: { label: "Configurações Gerais", icon: "⚙️", description: "WhatsApp e nome no cabeçalho", keys: ["whatsapp_number", "header_brand_name"] },
};

const keyLabels: Record<string, { label: string; hint?: string }> = {
  hero_badge: { label: "Etiqueta de destaque", hint: "Ex: 'Referência em saúde'" },
  hero_title: { label: "Título principal" },
  hero_subtitle: { label: "Subtítulo" },
  hero_cta_primary: { label: "Botão principal", hint: "Ex: 'Agende sua consulta'" },
  hero_cta_secondary: { label: "Botão secundário" },
  hero_stat_1: { label: "Destaque 1", hint: "Ex: '+10 anos'" },
  hero_stat_2: { label: "Destaque 2" },
  hero_stat_3: { label: "Destaque 3" },
  hero_float_title: { label: "Card flutuante — Título" },
  hero_float_subtitle: { label: "Card flutuante — Subtítulo" },
  hero_float_badge: { label: "Card flutuante — Etiqueta" },
  about_label: { label: "Etiqueta" },
  about_title: { label: "Título" },
  about_text_1: { label: "Primeiro parágrafo" },
  about_text_2: { label: "Segundo parágrafo" },
  about_mission: { label: "Missão" },
  about_vision: { label: "Visão" },
  about_values: { label: "Valores" },
  about_stat_1_value: { label: "Estatística 1 — Número" },
  about_stat_1_label: { label: "Estatística 1 — Descrição" },
  about_stat_2_value: { label: "Estatística 2 — Número" },
  about_stat_2_label: { label: "Estatística 2 — Descrição" },
  about_stat_3_value: { label: "Estatística 3 — Número" },
  about_stat_3_label: { label: "Estatística 3 — Descrição" },
  about_stat_4_value: { label: "Estatística 4 — Número" },
  about_stat_4_label: { label: "Estatística 4 — Descrição" },
  services_label: { label: "Etiqueta" },
  services_title: { label: "Título" },
  services_subtitle: { label: "Subtítulo" },
  exams_title: { label: "Título" },
  exams_data: { label: "Lista de exames", hint: "⚠️ Formato JSON — edite com cuidado" },
  convenios_label: { label: "Etiqueta" },
  convenios_title: { label: "Título" },
  convenios_subtitle: { label: "Subtítulo" },
  convenios_list: { label: "Lista de convênios", hint: "Separe por vírgula" },
  contact_label: { label: "Etiqueta" },
  contact_title: { label: "Título" },
  contact_address: { label: "Endereço" },
  contact_phone: { label: "Telefone" },
  contact_hours: { label: "Horário" },
  contact_email: { label: "E-mail" },
  cta_title: { label: "Título" },
  cta_subtitle: { label: "Subtítulo" },
  cta_button: { label: "Texto do botão" },
  faq_label: { label: "Etiqueta" },
  faq_title: { label: "Título" },
  faq_subtitle: { label: "Subtítulo" },
  faq_data: { label: "Perguntas e respostas", hint: "⚠️ Formato JSON — edite com cuidado" },
  gallery_label: { label: "Etiqueta" },
  gallery_title: { label: "Título" },
  gallery_subtitle: { label: "Subtítulo" },
  footer_description: { label: "Descrição da clínica" },
  footer_copyright: { label: "Copyright" },
  contact_page_label: { label: "Etiqueta" },
  contact_page_title: { label: "Título" },
  contact_page_subtitle: { label: "Subtítulo" },
  contact_page_cta_title: { label: "Título da chamada" },
  contact_page_cta_subtitle: { label: "Subtítulo da chamada" },
  whatsapp_number: { label: "WhatsApp", hint: "Com DDI. Ex: 5511999999999" },
  header_brand_name: { label: "Nome no cabeçalho" },
};

/* ── Component ── */
const AdminContent = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (items: { id: string; value: string }[]) => {
      for (const item of items) {
        const { error } = await supabase.from("site_content").update({ value: item.value }).eq("id", item.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Alterações salvas com sucesso!");
      setEditingSection(null);
      setDrafts({});
    },
    onError: () => toast.error("Erro ao salvar. Tente novamente."),
  });

  const contentByKey = new Map(contents.map((c) => [c.key, c]));

  const openEditor = (sectionKey: string) => {
    if (editingSection === sectionKey) {
      setEditingSection(null);
      setDrafts({});
      return;
    }
    const sec = sections[sectionKey];
    const initial: Record<string, string> = {};
    sec.keys.forEach((k) => {
      const item = contentByKey.get(k);
      if (item) initial[k] = item.value;
    });
    setDrafts(initial);
    setEditingSection(sectionKey);
  };

  const handleSave = () => {
    if (!editingSection) return;
    const sec = sections[editingSection];
    const updates = sec.keys
      .map((k) => {
        const item = contentByKey.get(k);
        if (!item) return null;
        const newValue = drafts[k];
        if (newValue === undefined || newValue === item.value) return null;
        return { id: item.id, value: newValue };
      })
      .filter(Boolean) as { id: string; value: string }[];

    if (updates.length === 0) {
      toast.info("Nenhuma alteração detectada.");
      setEditingSection(null);
      return;
    }
    saveMutation.mutate(updates);
  };

  const getSummary = (keys: string[]) => {
    const previews: string[] = [];
    for (const k of keys) {
      const item = contentByKey.get(k);
      if (item?.value && !k.includes("data")) {
        previews.push(item.value.length > 60 ? item.value.slice(0, 60) + "…" : item.value);
      }
      if (previews.length >= 2) break;
    }
    return previews;
  };

  const filteredSections = Object.entries(sections).filter(([, sec]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      sec.label.toLowerCase().includes(q) ||
      sec.description.toLowerCase().includes(q) ||
      sec.keys.some((k) => {
        const kl = keyLabels[k];
        const item = contentByKey.get(k);
        return (kl?.label ?? "").toLowerCase().includes(q) || (item?.value ?? "").toLowerCase().includes(q);
      })
    );
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Página Inicial</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edite os textos de cada seção do site. Clique em <Pencil className="inline w-3.5 h-3.5 mx-0.5" /> para abrir o editor.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <ExternalLink size={16} />
          Visualizar Site
        </a>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar seção ou conteúdo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-3 text-muted-foreground">Carregando...</span>
        </div>
      ) : (
        /* Section Cards */
        <div className="space-y-4">
          {filteredSections.map(([sectionKey, sec]) => {
            const sectionItems = sec.keys.map((k) => contentByKey.get(k)).filter(Boolean) as Content[];
            if (sectionItems.length === 0) return null;
            const summary = getSummary(sec.keys);
            const isEditing = editingSection === sectionKey;

            return (
              <div
                key={sectionKey}
                className="bg-card rounded-xl border border-border overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Card Header */}
                <div className="p-5 flex items-start gap-3">
                  <span className="text-2xl">{sec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{sec.label}</h3>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">
                        {sectionItems.length} {sectionItems.length === 1 ? "campo" : "campos"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{sec.description}</p>

                    {!isEditing && summary.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {summary.map((text, i) => (
                          <span key={i} className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-0.5 truncate max-w-xs">
                            {text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant={isEditing ? "secondary" : "outline"}
                    onClick={() => openEditor(sectionKey)}
                    className="gap-1.5 shrink-0"
                  >
                    {isEditing ? (
                      <>
                        <ChevronUp size={14} />
                        Fechar
                      </>
                    ) : (
                      <>
                        <Pencil size={14} />
                        Editar
                      </>
                    )}
                  </Button>
                </div>

                {/* Inline Editor */}
                {isEditing && (
                  <div className="border-t border-border bg-muted/20 px-5 pb-5 pt-4">
                    <div className="space-y-4">
                      {sec.keys.map((k) => {
                        const item = contentByKey.get(k);
                        if (!item) return null;
                        const kl = keyLabels[k];
                        const isLong = item.value.length > 80 || k.includes("data") || k.includes("text_");

                        return (
                          <div key={k}>
                            <div className="flex items-center gap-2 mb-1.5">
                              <label className="text-sm font-medium text-foreground">
                                {kl?.label ?? k}
                              </label>
                              {kl?.hint && k !== "exams_data" && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                  <Info size={12} />
                                  {kl.hint}
                                </span>
                              )}
                            </div>
                            {k === "exams_data" ? (
                              <ExamsEditor
                                value={drafts[k] ?? item.value}
                                onChange={(val) => setDrafts((prev) => ({ ...prev, [k]: val }))}
                              />
                            ) : k === "faq_data" ? (
                              <FaqEditor
                                value={drafts[k] ?? item.value}
                                onChange={(val) => setDrafts((prev) => ({ ...prev, [k]: val }))}
                              />
                            ) : isLong ? (
                              <Textarea
                                value={drafts[k] ?? item.value}
                                onChange={(e) => setDrafts((prev) => ({ ...prev, [k]: e.target.value }))}
                                rows={k.includes("data") ? 6 : 3}
                                className="font-mono text-xs"
                              />
                            ) : (
                              <Input
                                value={drafts[k] ?? item.value}
                                onChange={(e) => setDrafts((prev) => ({ ...prev, [k]: e.target.value }))}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingSection(null); setDrafts({}); }}
                        className="gap-1.5"
                      >
                        <X size={14} />
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="gap-1.5"
                      >
                        <Save size={14} />
                        {saveMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminContent;
