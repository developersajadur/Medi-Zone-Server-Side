import { Router } from "express";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";
import { orderController } from "./order.controller";


const router = Router()




router.post(
    '/create-order',
    auth(USER_ROLE.customer),
    orderController.createOrderIntoDb
  );

  router.get(
    '/verify-payment',
    auth(USER_ROLE.customer),
    orderController.verifyPayment,
  );

  router.get('/get-all-orders', auth(USER_ROLE.admin), orderController.getAllOrderFromDb)

  router.post('/change-order-status/:orderId/:orderStatus', auth(USER_ROLE.admin), orderController.changeOrderStatus)


export const orderRoute = router;