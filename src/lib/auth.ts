// src/lib/auth.ts
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET = (process.env.AUTH_SECRET || '').trim();
if (!SECRET) throw new Error('AUTH_SECRET не задан');

const encoder = new TextEncoder();
const KEY = encoder.encode(SECRET);

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || '__Host-cozyroll_sess';
export const AUTH_COOKIE_MAX_AGE = Number(process.env.AUTH_COOKIE_MAX_AGE || 60 * 60 * 24 * 7); // 7 дней

export async function verifyPassword(plain: string, hash: string) {
  try { return await bcrypt.compare(plain, hash); }
  catch { return false; }
}

export async function signSession(payload: { sub: string; role: 'admin' }) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + AUTH_COOKIE_MAX_AGE)
    .sign(KEY);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, KEY, { algorithms: ['HS256'] });
    if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null;
    return payload as { sub: string; role: 'admin'; iat: number; exp: number };
  } catch {
    return null;
  }
}

// CSRF (double-submit cookie)
export function makeCsrfToken() {
  // простая base64url строка
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(bytes).toString('base64url');
}
