import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { createUser, getUser } from '@/controllers/user';
import { prisma } from '@/prisma/client';

const app = new Koa();
const router = new Router();
app.use(bodyParser());
router.post('/users', createUser);
router.get('/users/:id', getUser);
app.use(router.routes());

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User Controller', () => {
  it('should create a user', async () => {
    const response = await request(app.callback())
      .post('/users')
      .send({ email: 'test@example.com', name: 'Test User' });
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('test@example.com');
    expect(response.body.name).toBe('Test User');
  });

  it('should get a user by ID', async () => {
    const user = await prisma.user.create({
      data: { email: 'get@example.com', name: 'Get User' },
    });
    const response = await request(app.callback()).get(`/users/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('get@example.com');
    expect(response.body.name).toBe('Get User');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app.callback()).get('/users/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
