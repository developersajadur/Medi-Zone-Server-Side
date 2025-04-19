import { Types } from "mongoose";

export type TCategory = {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    isDelete: boolean;
    createdAt: Date;
    updatedAt: Date;
}
