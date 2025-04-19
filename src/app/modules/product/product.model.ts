/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { model, Schema, Types } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    requiresPrescription: {
      type: Boolean,
      required: [true, 'Prescription requirement is required'],
    },
    manufacturer: {
      name: {
        type: String,
        required: [true, 'Manufacturer name is required'],
      },
      address: {
        type: String,
        required: [true, 'Manufacturer address is required'],
      },
      contact: {
        type: String,
        required: [true, 'Manufacturer contact is required'],
      },
    },
    expiryDate: {
      type: String,
      required: [true, 'Expiry date is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: [true, 'Product images are required'],
    },
    categories: [{
      type: Types.ObjectId,
      ref: 'Category',
      required: true
    }]
    
  },
  { timestamps: true }
);



// Middleware to exclude deleted records in find queries
productSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  if (!('isDeleted' in this.getQuery())) {
    this.where({ isDeleted: false });
  }
  next();
});

// Middleware to exclude deleted records in aggregation queries
productSchema.pre('aggregate', function (this: mongoose.Aggregate<any[]>, next) {
  const pipeline = this.pipeline() as mongoose.PipelineStage[];

  if (!pipeline.some(stage => (stage as mongoose.PipelineStage.Match)?.$match?.isDeleted !== undefined)) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
  }

  next();
});


export const Product = model<TProduct>('Product', productSchema);
