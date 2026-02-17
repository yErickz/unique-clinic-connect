import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent() {
  const { data: contentMap = {}, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((row) => { map[row.key] = row.value; });
      return map;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  /** Get content by key with fallback */
  const c = (key: string, fallback: string = "") => contentMap[key] ?? fallback;

  /** Parse JSON content with fallback */
  const cJson = <T,>(key: string, fallback: T): T => {
    try {
      return contentMap[key] ? JSON.parse(contentMap[key]) : fallback;
    } catch {
      return fallback;
    }
  };

  return { c, cJson, isLoading, contentMap };
}
