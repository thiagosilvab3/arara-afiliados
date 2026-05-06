import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export type AdminUser = {
  id: string;
  email: string | null;
};

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") {
    redirect("/login");
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}