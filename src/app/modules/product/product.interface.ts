import { Types } from "mongoose";

export type TProduct = {
    _id?: Types.ObjectId;
    slug?: string
    name: string;
    images: string[];
    description: string;
    price: number;
    stock: number;
    requiresPrescription: boolean;
    manufacturer: {
      name: string;
      address: string;
      contact: string;
    };
    expiryDate: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }