import { Context } from 'koa';
import { prisma } from '@/prisma/client';
import { encodeId, decodeId } from '@/utils/sqids';
import { MODEL_TYPES } from '@/types/models';

interface CreateUserBody {
  email: string;
  name?: string;
}

export const createUser = async (ctx: Context) => {
  const { email, name } = ctx.request.body as CreateUserBody;
  const user = await prisma.user.create({
    data: { email, name },
  });
  ctx.body = {
    ...user,
    id: encodeId(MODEL_TYPES.USER, user.id),
  };
};

export const getUser = async (ctx: Context) => {
  const id = decodeId(MODEL_TYPES.USER, ctx.params.id);
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid ID format' };
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }

  ctx.body = {
    ...user,
    id: encodeId(MODEL_TYPES.USER, user.id),
  };
};
