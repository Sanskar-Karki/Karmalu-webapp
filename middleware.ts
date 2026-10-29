import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin gate: refreshes the Supabase session cookie and sends signed-out
 * visitors to /admin/login. (Admin *permission* is checked again on the
 * server in lib/admin-auth.ts and enforced by database RLS.)
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isLogin = request.nextUrl.pathname === "/admin/login";
  if (!url || !key) {
    return isLogin ? response : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  let signedIn = false;
  try {
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } catch {
    signedIn = false;
  }

  if (!signedIn && !isLogin) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  // (Stay on login when it's explaining a problem, e.g. a non-admin account.)
  if (signedIn && isLogin && !request.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
