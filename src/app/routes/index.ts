import { Router } from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { userRoute } from '../modules/user/user.route';
import { productRoute } from '../modules/product/product.route';
import { orderRoute } from '../modules/order/order.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
