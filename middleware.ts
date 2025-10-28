import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;
  if(pathname === "/admin/login") return NextResponse.next();
  if(pathname.startsWith("/admin")){
    const token = req.cookies.get("cozyroll_auth")?.value;
    if(token !== "admin" && token !== "manager"){
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
