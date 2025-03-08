import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tokenDecoder } from "../auth/auth.utils";
import { orderService } from "./order.service";


const createOrderIntoDb = catchAsync(async (req, res) => {
    const orderData = req.body;
    const decoded = tokenDecoder(req);
    const { userId } = decoded;
    orderData.user = userId;

    const order = await orderService.createOrderIntoDb(req?.body, userId, req.ip!);
    const orderResponse = JSON.parse(JSON.stringify(order));

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Order created successfully",
        data: orderResponse
    });
 });

 const verifyPayment = catchAsync(async (req, res) => {
    console.log(req.query.order_id);
    const order = await orderService.verifyPayment(req.query.order_id as string);
  
    // Ensure we return only serializable objects
    const verifiedPaymentResponse = JSON.parse(JSON.stringify(order));
  
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: 'Order verified successfully',
      data: verifiedPaymentResponse,
    });
  });


 export const orderController = {
    createOrderIntoDb,
    verifyPayment
 };
