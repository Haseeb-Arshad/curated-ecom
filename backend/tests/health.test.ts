import { describe, it, expect } from 'bun:test';
import server from '../src/index';

describe('health', () => {
  it('returns ok true', async () => {
    const res = await server.fetch(new Request('http://localhost/health'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
