// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import redirect_map from "./redirects/redirects";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const redirect_detail = redirect_map.get(url.pathname);
  if (redirect_detail) {
    let status = redirect_detail["permanent"] ? 308 : 307;
    return NextResponse.redirect(new URL(redirect_detail.destination, request.url), status);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
