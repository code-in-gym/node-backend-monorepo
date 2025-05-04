import Router from 'koa-router';
import { createUser, getUser } from '@/controllers/user';

const router = new Router();

router.post('/users', createUser);
router.get('/users/:id', getUser);

export default router;
