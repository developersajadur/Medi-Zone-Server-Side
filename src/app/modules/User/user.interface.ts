import { Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserRole = keyof typeof USER_ROLE;