import { Context } from 'koa';
import { prisma } from '@/prisma/client';

export const createUser = async (ctx: Context) => {
  const { email, name } = ctx.request.body as { email: string; name?: string };
  const user = await prisma.user.create({
    data: { email, name },
  });
  ctx.body = user;
};

export const getUser = async (ctx: Context) => {
  const { id } = ctx.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }
  ctx.body = user;
};
