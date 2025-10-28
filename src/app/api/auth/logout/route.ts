import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
export const runtime = 'nodejs';

export async function POST(req: Request){
  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  res.headers.append('Set-Cookie', `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV==='production'?'Secure;':''}`);
  res.headers.append('Set-Cookie', `cozyroll_csrf=; Path=/; Max-Age=0; SameSite=Lax; ${process.env.NODE_ENV==='production'?'Secure;':''}`);
  return res;
}
