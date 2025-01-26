import { Router } from "express";
import { biCycleRoute } from "../modules/Bicycle/bicycle.route";
import { userRoute } from "../modules/User/user.route";
import { authRoute } from "../modules/Auth/auth.route";
import { orderRoute } from "../modules/Orders/order.route";
import { paymentRoutes } from "../modules/Payment/payment.route";



const router = Router();

const moduleRoutes = [
    {
        path: '/bicycles',
        route: biCycleRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/',
        route: authRoute
    },
    {
        path: '/orders',
        route: orderRoute
    },
    {
        path: '/payments',
        route: paymentRoutes
    },
]






moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;