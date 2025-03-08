import { Types } from "mongoose";


export type TOrderProduct = {
    product: Types.ObjectId;
    quantity: number;
    prescription?: string;
    prescriptionStatus?: "pending" | "approved" | "rejected";
  }

export type TOrder = {
    _id?: string;
    user: Types.ObjectId;
    products: TOrderProduct[]
    totalAmount: number;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    paymentMethod: 'cash' | 'card' | 'online';
    transactionId?: string;
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      phone: string;
    };
    requiresPrescription?: boolean;
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "canceled";
    createdAt?: Date;
    updatedAt?: Date;
  }
  