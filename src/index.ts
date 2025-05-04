import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import koaPino from 'koa-pino-logger';
import logger from '@/utils/logger';
import healthRoutes from '@/routes';
import userRoutes from '@/routes/user';

const app = new Koa();
const router = new Router();

app.use(koaPino(logger));
app.use(bodyParser());
router.use('/api', healthRoutes.routes(), userRoutes.routes());
app.use(router.routes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
