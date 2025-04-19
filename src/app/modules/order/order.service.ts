import status from "http-status";
import { Product } from "../product/product.model";
import { TOrder, TOrderStatus } from "./order.interface";
import AppError from "../../errors/AppError";
import { Order } from "./order.model";
import { generateTransactionId } from "../payment/payment.utils";
import { Payment } from "../payment/payment.model";
import { orderUtils } from "./order.utils";
import { User } from "../user/user.model";
import QueryBuilder from "../../builders/QueryBuilder";
import { orderSearchableFields } from "./order.constant";


const createOrderIntoDb = async (order: Partial<TOrder>, authUserId: string, client_ip: string) => {
    const userData = await User.findById(authUserId).lean();
    if (!userData) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }
    let totalAmount = 0; // Initialize total amount

    if (order.products) {
        for (const product of order.products) {
            const productInDb = await Product.findById(product.product);
            if (!productInDb) {
                throw new AppError(status.NOT_FOUND, `Product ${product.product} not found`);
            } else if (productInDb.isDeleted) {
                throw new AppError(status.FORBIDDEN, `Product ${product.product} is deleted`);
            }
            if (productInDb.stock < product.quantity) {
                throw new AppError(status.UNPROCESSABLE_ENTITY, `Insufficient stock for product: ${product.product}`);
            }

            // Calculate the price for this product and add it to totalAmount
            const productTotal = productInDb.price * product.quantity;
            totalAmount += productTotal;

            productInDb.stock -= product.quantity;
            await productInDb.save();
        }
    }

    // Set the totalAmount in the order data
    order.totalAmount = totalAmount;

    const orderInDb = await Order.create(order);

    const transactionId = generateTransactionId();

    const payment = new Payment({
        user: authUserId,
        order: orderInDb._id,
        method: orderInDb.paymentMethod,
        transactionId,
        amount: orderInDb.totalAmount,
        paymentMethod: orderInDb.paymentMethod
    });

    await payment.save();

    const shurjopayPayload = {
        amount: orderInDb.totalAmount,
        order_id: orderInDb._id,
        currency: 'BDT',
        customer_name: order.shippingAddress?.fullName,
        customer_address: order.shippingAddress?.address,
        customer_email: userData?.email,
        customer_phone: order.shippingAddress?.phone,
        customer_city: order.shippingAddress?.city,
        client_ip,
    };

    const makePayment = await orderUtils.makePaymentAsync(shurjopayPayload);

    return makePayment.checkout_url;
}


const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);
  
    if (verifiedPayment.length) {
      await Order.findOneAndUpdate(
        {
          'transaction.id': order_id,
        },
        {
          'transaction.bank_status': verifiedPayment[0].bank_status,
          'transaction.sp_code': verifiedPayment[0].sp_code,
          'transaction.sp_message': verifiedPayment[0].sp_message,
          'transaction.transactionStatus': verifiedPayment[0].transaction_status,
          'transaction.method': verifiedPayment[0].method,
          'transaction.date_time': verifiedPayment[0].date_time,
          status:
            verifiedPayment[0].bank_status == 'Success'
              ? 'Paid'
              : verifiedPayment[0].bank_status == 'Failed'
                ? 'Pending'
                : verifiedPayment[0].bank_status == 'Cancel'
                  ? 'Cancelled'
                  : '',
        },
      );
    }
  
    return verifiedPayment;
  };

  const getAllOrderFromDb =async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(
      Order.find().lean(),
      query,
    )
      .search(orderSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const orders = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { orders, meta };
  }



  const changeOrderStatus = async (orderId: string, orderStatus: TOrderStatus) => {
    const order = await Order.findById(orderId).lean();
    if (!order) {
        throw new AppError(status.NOT_FOUND, 'Order not found');
    }

    const statusOrder = ["pending", "processing", "shipped", "delivered", "canceled"];

    const currentStatusIndex = statusOrder.indexOf(order.orderStatus);
    const newStatusIndex = statusOrder.indexOf(orderStatus);

    if (newStatusIndex < currentStatusIndex) {
        throw new AppError(status.BAD_REQUEST, `Cannot reverse order status from ${order.orderStatus} to ${orderStatus}`);
    }
    if(order.orderStatus === orderStatus) {
        throw new AppError(status.BAD_REQUEST, `Order status is already ${orderStatus}`);
    }

    const updatedOrderStatus = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: orderStatus },
        { new: true, lean: true }
    );
    

    return updatedOrderStatus;
};



export const orderService = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrderFromDb,
    changeOrderStatus
}