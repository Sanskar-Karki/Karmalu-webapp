import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/** Signed-in Supabase client for admin pages and actions. */
export async function adminClient() {
  return createClient(await cookies());
}

/**
 * Returns the signed-in admin's client and email, or redirects to login.
 * Non-admin accounts are sent to the login page with an explanation.
 */
export async function requireAdmin() {
  const supabase = await adminClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");

  return { supabase, email: data.user.email ?? "" };
}
