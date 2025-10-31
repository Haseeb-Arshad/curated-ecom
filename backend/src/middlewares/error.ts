import type { MiddlewareHandler } from 'hono';

export function errorHandler(): MiddlewareHandler {
  return async (c, next) => {
    try {
      await next();
    } catch (err: any) {
      const status = err?.status || 500;
      const message = err?.message || 'Internal Server Error';
      c.status(status);
      return c.json({ error: { message, status } });
    }
  };
}
