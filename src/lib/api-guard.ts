// src/lib/api-guard.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySession } from './auth';

export async function requireAdmin(req: Request) {
  const cookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) return NextResponse.json({error:'unauthorized'}, {status:401});
  const session = await verifySession(cookie);
  if (!session) return NextResponse.json({error:'unauthorized'}, {status:401});
  return null as unknown as Response; // всё ок
}

export function requireCsrf(fd: FormData) {
  const csrfBody = String(fd.get('csrf')||'');
  const csrfCookie = cookies().get('cozyroll_csrf')?.value || '';
  return csrfBody.length>0 && csrfBody === csrfCookie;
}
