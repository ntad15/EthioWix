import { LandingPage } from "@/components/LandingPage";
import { DashboardHome } from "@/components/DashboardHome";

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

export default async function Home() {
  if (AUTH_DISABLED) {
    return <DashboardHome />;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? <DashboardHome /> : <LandingPage />;
}
