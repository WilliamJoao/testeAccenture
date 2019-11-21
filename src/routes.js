import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/signup', UserController.store);
routes.get('/signin', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);

export default routes;
