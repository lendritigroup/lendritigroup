import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/(fi|sv)(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(fi|sv)/, "") || "/";
    const redirect = NextResponse.redirect(url);
    redirect.cookies.delete("NEXT_LOCALE");
    return redirect;
  }

  const isAdminPath = /(?:^|\/)admin(?:\/|$)/.test(pathname);
  const isLogin = /(?:^|\/)login(?:\/|$)/.test(pathname);

  if (isAdminPath && !isLogin) {
    const token = request.cookies.get("lg_admin")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      const localeMatch = pathname.match(/^\/(en|de)(\/|$)/);
      url.pathname = localeMatch ? `/${localeMatch[1]}/login` : "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = intlMiddleware(request);
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (localeCookie && !["sq", "en", "de"].includes(localeCookie)) {
    response.cookies.set("NEXT_LOCALE", "sq", { path: "/" });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|images|.*\\..*).*)"],
};
