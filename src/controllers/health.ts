import { Context } from 'koa';

export const healthCheck = async (ctx: Context) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
};
