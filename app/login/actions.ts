"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Preencha%20e-mail%20e%20senha.");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=E-mail%20ou%20senha%20inv%C3%A1lidos.");
  }

  redirect("/admin");
}