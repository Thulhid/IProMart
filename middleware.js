import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const promo = url.searchParams.get("promo");

  if (!promo) return NextResponse.next();

  const cleanUrl = url.clone();
  cleanUrl.searchParams.delete("promo");

  const res = NextResponse.redirect(cleanUrl);
  res.cookies.set("promo_token", promo, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}

export const config = {
  matcher: ["/products/:path*"],
};
