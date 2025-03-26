/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export type TPayment = {
  user: Types.ObjectId;
  order: Types.ObjectId;
  method:  'cash' | 'card' | 'online' | 'shurjo-pay';
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  amount: number;
  gatewayResponse?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
