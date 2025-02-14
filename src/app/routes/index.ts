import { Router } from 'express';
import { authRoute } from '../modules/auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/',
    route: authRoute,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
