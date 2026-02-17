import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Search, Check, X, ChevronDown, ChevronRight, Info } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Content = Tables<"site_content">;

const sections: Record<string, { label: string; icon: string; description: string; keys: string[] }> = {
  hero: { label: "Página Inicial - Topo", icon: "🏠", description: "Textos do banner principal que aparece no topo do site", keys: ["hero_badge", "hero_title", "hero_subtitle", "hero_cta_primary", "hero_cta_secondary", "hero_stat_1", "hero_stat_2", "hero_stat_3", "hero_float_title", "hero_float_subtitle", "hero_float_badge"] },
  about: { label: "Sobre a Clínica", icon: "ℹ️", description: "Informações sobre a clínica, missão, visão e valores", keys: ["about_label", "about_title", "about_text_1", "about_text_2", "about_mission", "about_vision", "about_values", "about_stat_1_value", "about_stat_1_label", "about_stat_2_value", "about_stat_2_label", "about_stat_3_value", "about_stat_3_label", "about_stat_4_value", "about_stat_4_label"] },
  services: { label: "Especialidades", icon: "🩺", description: "Títulos da seção de especialidades médicas", keys: ["services_label", "services_title", "services_subtitle"] },
  exams: { label: "Exames", icon: "🧪", description: "Lista de exames disponíveis na clínica", keys: ["exams_title", "exams_data"] },
  convenios: { label: "Convênios", icon: "🏥", description: "Convênios aceitos pela clínica", keys: ["convenios_label", "convenios_title", "convenios_subtitle", "convenios_list"] },
  contact: { label: "Contato (na página inicial)", icon: "📍", description: "Informações de contato exibidas na página inicial", keys: ["contact_label", "contact_title", "contact_address", "contact_phone", "contact_hours", "contact_email"] },
  cta: { label: "Chamada para Ação", icon: "📢", description: "Seção final que convida o visitante a agendar", keys: ["cta_title", "cta_subtitle", "cta_button"] },
  faq: { label: "Perguntas Frequentes", icon: "❓", description: "Perguntas e respostas exibidas no site", keys: ["faq_label", "faq_title", "faq_subtitle", "faq_data"] },
  gallery: { label: "Galeria de Fotos", icon: "🖼️", description: "Títulos da seção de fotos da clínica", keys: ["gallery_label", "gallery_title", "gallery_subtitle"] },
  footer: { label: "Rodapé do Site", icon: "📄", description: "Texto que aparece no rodapé de todas as páginas", keys: ["footer_description", "footer_copyright"] },
  contact_page: { label: "Página de Contato", icon: "📞", description: "Textos da página dedicada de contato", keys: ["contact_page_label", "contact_page_title", "contact_page_subtitle", "contact_page_cta_title", "contact_page_cta_subtitle"] },
  general: { label: "Configurações Gerais", icon: "⚙️", description: "WhatsApp e nome da clínica no cabeçalho", keys: ["whatsapp_number", "header_brand_name"] },
};

const keyLabels: Record<string, { label: string; hint?: string }> = {
  hero_badge: { label: "Etiqueta de destaque", hint: "Ex: 'Referência em saúde'" },
  hero_title: { label: "Título principal", hint: "A frase grande no topo do site" },
  hero_subtitle: { label: "Subtítulo", hint: "Texto menor abaixo do título" },
  hero_cta_primary: { label: "Texto do botão principal", hint: "Ex: 'Agende sua consulta'" },
  hero_cta_secondary: { label: "Texto do botão secundário", hint: "Ex: 'Conheça nossos serviços'" },
  hero_stat_1: { label: "Destaque 1", hint: "Ex: '+10 anos'" },
  hero_stat_2: { label: "Destaque 2", hint: "Ex: '+20 especialidades'" },
  hero_stat_3: { label: "Destaque 3", hint: "Ex: '+50 mil atendimentos'" },
  hero_float_title: { label: "Card flutuante - Título" },
  hero_float_subtitle: { label: "Card flutuante - Subtítulo" },
  hero_float_badge: { label: "Card flutuante - Etiqueta" },
  about_label: { label: "Etiqueta da seção" },
  about_title: { label: "Título da seção" },
  about_text_1: { label: "Primeiro parágrafo" },
  about_text_2: { label: "Segundo parágrafo" },
  about_mission: { label: "Missão" },
  about_vision: { label: "Visão" },
  about_values: { label: "Valores" },
  about_stat_1_value: { label: "Estatística 1 - Número", hint: "Ex: '+10'" },
  about_stat_1_label: { label: "Estatística 1 - Descrição", hint: "Ex: 'Anos de experiência'" },
  about_stat_2_value: { label: "Estatística 2 - Número" },
  about_stat_2_label: { label: "Estatística 2 - Descrição" },
  about_stat_3_value: { label: "Estatística 3 - Número" },
  about_stat_3_label: { label: "Estatística 3 - Descrição" },
  about_stat_4_value: { label: "Estatística 4 - Número" },
  about_stat_4_label: { label: "Estatística 4 - Descrição" },
  services_label: { label: "Etiqueta da seção" },
  services_title: { label: "Título da seção" },
  services_subtitle: { label: "Subtítulo da seção" },
  exams_title: { label: "Título da seção" },
  exams_data: { label: "Lista de exames", hint: "⚠️ Formato técnico (JSON). Edite com cuidado." },
  convenios_label: { label: "Etiqueta da seção" },
  convenios_title: { label: "Título da seção" },
  convenios_subtitle: { label: "Subtítulo da seção" },
  convenios_list: { label: "Lista de convênios", hint: "Separe cada convênio por vírgula" },
  contact_label: { label: "Etiqueta da seção" },
  contact_title: { label: "Título da seção" },
  contact_address: { label: "Endereço completo" },
  contact_phone: { label: "Telefone" },
  contact_hours: { label: "Horário de funcionamento" },
  contact_email: { label: "E-mail" },
  cta_title: { label: "Título" },
  cta_subtitle: { label: "Subtítulo" },
  cta_button: { label: "Texto do botão" },
  faq_label: { label: "Etiqueta da seção" },
  faq_title: { label: "Título da seção" },
  faq_subtitle: { label: "Subtítulo da seção" },
  faq_data: { label: "Perguntas e respostas", hint: "⚠️ Formato técnico (JSON). Edite com cuidado." },
  gallery_label: { label: "Etiqueta da seção" },
  gallery_title: { label: "Título da seção" },
  gallery_subtitle: { label: "Subtítulo da seção" },
  footer_description: { label: "Descrição da clínica" },
  footer_copyright: { label: "Texto de copyright" },
  contact_page_label: { label: "Etiqueta da página" },
  contact_page_title: { label: "Título da página" },
  contact_page_subtitle: { label: "Subtítulo da página" },
  contact_page_cta_title: { label: "Título da chamada para ação" },
  contact_page_cta_subtitle: { label: "Subtítulo da chamada para ação" },
  whatsapp_number: { label: "Número do WhatsApp", hint: "Com código do país. Ex: 5511999999999" },
  header_brand_name: { label: "Nome exibido no cabeçalho do site" },
};

const AdminContent = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

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
      toast.success("✅ Texto salvo com sucesso!");
      setEditingId(null);
    },
    onError: () => toast.error("Erro ao salvar. Tente novamente."),
  });

  const contentByKey = new Map(contents.map((c) => [c.key, c]));

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredSections = Object.entries(sections).filter(([, sec]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return sec.label.toLowerCase().includes(q) || sec.description.toLowerCase().includes(q) || sec.keys.some((k) => {
      const item = contentByKey.get(k);
      const kl = keyLabels[k];
      return (kl?.label ?? "").toLowerCase().includes(q) || (item?.value ?? "").toLowerCase().includes(q);
    });
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Editar Textos do Site</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Clique no botão <Pencil className="inline w-3.5 h-3.5 mx-0.5" /> ao lado de cada texto para editá-lo. As alterações aparecem no site em tempo real.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou conteúdo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-3 text-muted-foreground">Carregando textos...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSections.map(([sectionKey, sec]) => {
            const sectionItems = sec.keys.map((k) => contentByKey.get(k)).filter(Boolean) as Content[];
            if (sectionItems.length === 0) return null;
            const isCollapsed = collapsedSections.has(sectionKey);

            return (
              <div key={sectionKey} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sec.icon}</span>
                    <div>
                      <h2 className="font-semibold text-foreground text-sm">{sec.label}</h2>
                      <p className="text-xs text-muted-foreground">{sec.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {sectionItems.length} {sectionItems.length === 1 ? "campo" : "campos"}
                    </span>
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="divide-y divide-border border-t border-border">
                    {sectionItems.map((item) => {
                      const isEditing = editingId === item.id;
                      const isLong = item.value.length > 80 || item.key.includes("data") || item.key.includes("text_");
                      const kl = keyLabels[item.key];

                      return (
                        <div key={item.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-foreground">
                                  {kl?.label ?? item.key}
                                </p>
                                {kl?.hint && (
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <Info className="w-3 h-3" />
                                    {kl.hint}
                                  </span>
                                )}
                              </div>

                              {isEditing ? (
                                <div className="space-y-3 mt-2">
                                  {isLong ? (
                                    <Textarea
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      rows={item.key.includes("data") ? 8 : 3}
                                      className="font-mono text-xs"
                                      autoFocus
                                    />
                                  ) : (
                                    <Input
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      autoFocus
                                    />
                                  )}
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => saveMutation.mutate({ id: item.id, value: editValue })}
                                      disabled={saveMutation.isPending}
                                      className="gap-1.5"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      {saveMutation.isPending ? "Salvando..." : "Salvar"}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="gap-1.5">
                                      <X className="w-3.5 h-3.5" />
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                                  {item.value || <span className="italic">Vazio — clique para editar</span>}
                                </p>
                              )}
                            </div>
                            {!isEditing && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { setEditingId(item.id); setEditValue(item.value); }}
                                className="shrink-0 gap-1.5"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Editar
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
