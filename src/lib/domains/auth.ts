const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

export async function getAuthUserId(): Promise<string | null> {
  if (AUTH_DISABLED) return "local-dev-user";
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}
