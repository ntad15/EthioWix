import { SiteConfig } from "@/types/site-config";
import { createClient } from "@/lib/supabase/server";

// Maps DB row → SiteConfig
function rowToConfig(row: Record<string, unknown>): SiteConfig {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    slug: row.slug as string,
    templateId: row.template_id as string,
    theme: row.theme as SiteConfig["theme"],
    sections: row.sections as SiteConfig["sections"],
    published: row.published as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getSitesByUserId(userId: string): Promise<SiteConfig[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToConfig);
}

export async function getSiteById(id: string): Promise<SiteConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ? rowToConfig(data) : null;
}

export async function getSiteBySlug(slug: string): Promise<SiteConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ? rowToConfig(data) : null;
}

export async function saveSite(config: SiteConfig): Promise<SiteConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .upsert({
      id: config.id,
      user_id: config.userId,
      name: config.name,
      slug: config.slug,
      template_id: config.templateId,
      theme: config.theme,
      sections: config.sections,
      published: config.published,
      created_at: config.createdAt,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return rowToConfig(data);
}

export async function deleteSite(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
