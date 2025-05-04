import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { createUser, getUser } from '@/controllers/user';

vi.mock('@/prisma/client', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    $disconnect: vi.fn(),
  },
}));

import { prisma } from '@/prisma/client';

const app = new Koa();
const router = new Router();
app.use(bodyParser());
router.post('/users', createUser);
router.get('/users/:id', getUser);
app.use(router.routes());

beforeEach(() => {
  vi.resetAllMocks();
});

describe('User Controller', () => {
  it('should create a user', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    const response = await request(app.callback())
      .post('/users')
      .send({ email: 'test@example.com', name: 'Test User' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com', name: 'Test User' },
    });
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: 1, email: 'get@example.com', name: 'Get User' };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    const response = await request(app.callback()).get('/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return 404 for non-existent user', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app.callback()).get('/users/999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
