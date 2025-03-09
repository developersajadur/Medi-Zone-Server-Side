import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tokenDecoder } from "../auth/auth.utils";
import { orderService } from "./order.service";
import { TOrderStatus } from "./order.interface";


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


  const getAllOrderFromDb = catchAsync(async (req, res) => {
    const orders = await orderService.getAllOrderFromDb(req?.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: orders
    });
  });


  const changeOrderStatus = catchAsync(async (req,res) => {
    const {orderId, orderStatus} = req.params;
    const updatedOrder = await orderService.changeOrderStatus(orderId, orderStatus as TOrderStatus);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    })
  })


 export const orderController = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrderFromDb,
    changeOrderStatus
 };
