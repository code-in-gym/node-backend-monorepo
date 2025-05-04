import { describe, it, expect } from 'vitest';
import request from 'supertest';
import Koa from 'koa';
import Router from 'koa-router';
import { healthCheck } from '@/controllers/health';

const app = new Koa();
const router = new Router();
router.get('/health', healthCheck);
app.use(router.routes());

describe('Health Controller', () => {
  it('should return status ok', async () => {
    const response = await request(app.callback()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});
