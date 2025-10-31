import { describe, it, expect } from 'bun:test';
import server from '../src/index';

describe('products', () => {
  it('lists products (empty without supabase)', async () => {
    const res = await server.fetch(new Request('http://localhost/api/products'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
  });
});
