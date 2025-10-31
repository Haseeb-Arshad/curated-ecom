import type { MiddlewareHandler } from 'hono';
import { env } from '../env';
import { jwtVerify, createRemoteJWKSet } from 'jose';

type User = { sub: string; role?: string };

declare module 'hono' {
  interface ContextVariableMap {
    user?: User | null;
  }
}

export function authOptional(): MiddlewareHandler {
  // Prefer verifying with Supabase JWT secret if provided, else try JWKs from the instance if SUPABASE_URL is present
  const secret = env.SUPABASE_JWT_SECRET ? new TextEncoder().encode(env.SUPABASE_JWT_SECRET) : null;
  const jwks = env.SUPABASE_URL ? createRemoteJWKSet(new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)) : null;

  return async (c, next) => {
    const auth = c.req.header('authorization');
    if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
      c.set('user', null);
      return next();
    }
    const token = auth.slice(7).trim();
    try {
      let payload: any;
      if (secret) {
        const { payload: p } = await jwtVerify(token, secret);
        payload = p;
      } else if (jwks) {
        const { payload: p } = await jwtVerify(token, jwks);
        payload = p;
      } else {
        c.set('user', null);
        return next();
      }
      c.set('user', { sub: payload.sub, role: payload.role });
    } catch {
      c.set('user', null);
    }
    await next();
  };
}
