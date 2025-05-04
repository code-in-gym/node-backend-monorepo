import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { createUser, getUser } from '@/controllers/user';
import { encodeId } from '@/utils/sqids';
import { MODEL_TYPES } from '@/types/models';

// 模拟 ModelIdManager 的行为
const mockEncodedIds = new Map<string, string>();
const mockDecodedIds = new Map<string, number | null>();

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

vi.mock('@/utils/sqids', () => ({
  encodeId: vi.fn((modelType: string, id: number) => {
    const key = `${modelType}_${id}`;
    const encodedId = mockEncodedIds.get(key) || `encoded_${modelType}_${id}`;
    mockEncodedIds.set(key, encodedId);
    return encodedId;
  }),
  decodeId: vi.fn((modelType: string, hash: string) => {
    const id = mockDecodedIds.get(hash);
    if (id !== undefined) return id;

    const match = hash.match(new RegExp(`^encoded_${modelType}_(\\d+)$`));
    if (!match) return null;

    const decodedId = parseInt(match[1]);
    mockDecodedIds.set(hash, decodedId);
    return decodedId;
  }),
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
  mockEncodedIds.clear();
  mockDecodedIds.clear();
});

describe('User Controller', () => {
  it('should create a user', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    const encodedId = `encoded_${MODEL_TYPES.USER}_1`;
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);
    mockEncodedIds.set(`${MODEL_TYPES.USER}_1`, encodedId);

    const response = await request(app.callback())
      .post('/users')
      .send({ email: 'test@example.com', name: 'Test User' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...mockUser, id: encodedId });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com', name: 'Test User' },
    });
    expect(encodeId).toHaveBeenCalledWith(MODEL_TYPES.USER, 1);
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: 1, email: 'get@example.com', name: 'Get User' };
    const encodedId = `encoded_${MODEL_TYPES.USER}_1`;
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    mockEncodedIds.set(`${MODEL_TYPES.USER}_1`, encodedId);
    mockDecodedIds.set(encodedId, 1);

    const response = await request(app.callback()).get(`/users/${encodedId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...mockUser, id: encodedId });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(encodeId).toHaveBeenCalledWith(MODEL_TYPES.USER, 1);
  });

  it('should return 404 for non-existent user', async () => {
    const encodedId = `encoded_${MODEL_TYPES.USER}_999`;
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    mockDecodedIds.set(encodedId, 999);

    const response = await request(app.callback()).get(`/users/${encodedId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it('should return 400 for invalid ID format', async () => {
    const response = await request(app.callback()).get('/users/invalid_id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid ID format');
  });

  it('should return 400 for wrong model type ID', async () => {
    const encodedId = `encoded_${MODEL_TYPES.POST}_1`;
    mockDecodedIds.set(encodedId, null);

    const response = await request(app.callback()).get(`/users/${encodedId}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid ID format');
  });
});
