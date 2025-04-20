import { Types } from "mongoose";

export type TProduct = {
  _id?: Types.ObjectId;
  slug: string;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: {
    name: string;
    address: string;
    contact: string;
  };
  categories: Types.ObjectId[];
  expiryDate: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
