import { Types } from "mongoose";


// export type TPrescriptionStatus = "pending" | "approved" | "rejected";
export type TPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type TPaymentMethod = 'cash' | 'card' | 'online' | 'shurjo-pay';
export type TOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "canceled";


export type TOrderProduct = {
    product: Types.ObjectId;
    quantity: number;
  }

export type TOrder = {
    _id: string;
    user: Types.ObjectId;
    products: TOrderProduct[]
    totalAmount: number;
    paymentStatus: TPaymentStatus;
    paymentMethod: TPaymentMethod;
    transactionId?: string;
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      phone: string;
    };
    orderStatus: TOrderStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }
  