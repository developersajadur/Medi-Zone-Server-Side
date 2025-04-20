
import { z } from "zod";
import mongoose from "mongoose";


// ObjectId validation
const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId format",
  });

// Order Product Schema
const orderProductSchema = z.object({
  product: objectIdSchema,
  quantity: z.number()
    .min(1, { message: "Quantity must be at least 1" }),
});

// Shipping Address Schema
const shippingAddressSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

// Main Order Schema
export const createOrderValidation = z.object({
  user: objectIdSchema,
  products: z.array(orderProductSchema).min(1, { message: "At least one product is required" }),
  totalAmount: z.number().min(0, { message: "Total amount must be provided and non-negative" }),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  paymentMethod: z.enum(["cash", "card", "online", "shurjo-pay"]),
  transactionId: z.string().optional(),
  shippingAddress: shippingAddressSchema,
  orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]).default("pending"),
});




export const OrderValidationSchema = {
    createOrderValidation,
  };
  