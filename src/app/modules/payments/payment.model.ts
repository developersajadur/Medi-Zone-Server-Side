import mongoose, { Schema } from "mongoose";
import { TPayment } from "./payment.interface";


const PaymentSchema: Schema = new Schema<TPayment>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
      order: { type: Schema.Types.ObjectId, ref: 'Order', required: [true, 'Order is required'] },
      method: {
        type: String,
        enum: ['cash', 'card', 'online'],
        required: [true, 'Payment method is required'],
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        required: [true, 'Payment status is required'],
        default: 'pending',
      },
      transactionId: { type: String },
      amount: { type: Number, required: [true, 'Amount is required'] },
      gatewayResponse: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
  );
  
  
 export const Payment = mongoose.model<TPayment>('Payment', PaymentSchema);
  