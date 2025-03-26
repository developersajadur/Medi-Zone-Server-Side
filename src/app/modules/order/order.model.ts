import mongoose from "mongoose";
import { Schema } from "mongoose";  // Corrected import statement
import { TOrder, TOrderProduct } from "./order.interface";

const OrderProductSchema = new Schema<TOrderProduct>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: [true, "Product is required"] },
    quantity: { type: Number, required: [true, "Quantity is required"], min: [1, "Quantity must be at least 1"] },
    prescription: { type: String },
    prescriptionStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
});

const OrderSchema = new Schema<TOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
    products: { type: [OrderProductSchema], required: [true, "Products are required"] },
    totalAmount: { type: Number, required: [true, "Total amount is required"] },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      required: [true, "Payment status is required"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online", "shurjo-pay"],
      required: [true, "Payment method is required"],
    },
    transactionId: { type: String },
    shippingAddress: {
      fullName: { type: String, required: [true, "Full name is required"] },
      address: { type: String, required: [true, "Address is required"] },
      city: { type: String, required: [true, "City is required"] },
      postalCode: { type: String, required: [true, "Postal code is required"] },
      country: { type: String, required: [true, "Country is required"] },
      phone: { type: String, required: [true, "Phone number is required"] },
    },
    requiresPrescription: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);


export const Order = mongoose.model<TOrder>("Order", OrderSchema);
