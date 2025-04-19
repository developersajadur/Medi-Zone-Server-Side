/* eslint-disable @typescript-eslint/no-explicit-any */
// models/Category.ts

import mongoose, { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);



// Middleware to exclude deleted records in find queries
categorySchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  if (!('isDelete' in this.getQuery())) {
    this.where({ isDelete: false });
  }
  next();
});

// Middleware to exclude deleted records in aggregation queries
categorySchema.pre('aggregate', function (this: mongoose.Aggregate<any[]>, next) {
  const pipeline = this.pipeline() as mongoose.PipelineStage[];

  const hasIsDeleteCheck = pipeline.some(stage => 
    (stage as mongoose.PipelineStage.Match)?.$match?.isDelete !== undefined
  );

  if (!hasIsDeleteCheck) {
    this.pipeline().unshift({ $match: { isDelete: false } });
  }

  next();
});


export const Category = model<TCategory>("Category", categorySchema);
