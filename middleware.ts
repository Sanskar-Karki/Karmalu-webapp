import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export function middleware(request: NextRequest) {
  // Refreshes the Supabase auth session cookie on each request.
  return createClient(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image optimization.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
