import status from "http-status";
import { Category } from "../category/category.model";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";

export const validateCategoryIds = async (categoryIds: string[]) => {
    // Convert categoryIds to ObjectId if they are in string form
    const categoryObjectIds = categoryIds.map(id => 
        mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null
    ).filter(Boolean); // Filter out any invalid ObjectIds

    if (categoryObjectIds.length !== categoryIds.length) {
        throw new AppError(
            status.BAD_REQUEST,
            "One or more provided category IDs are invalid."
        );
    }

    // Use aggregation to find categories that are not deleted
    const categories = await Category.aggregate([
        { $match: { _id: { $in: categoryObjectIds }, isDeleted: false } },
        { $project: { _id: 1 } } // Only project the _id field
    ]);

    // Extract valid category IDs from the result
    const validCategoryIds = new Set(categories.map(category => category._id.toString()));

    // Check for invalid category IDs
    const invalidCategories = categoryIds.filter(id => !validCategoryIds.has(id));

    if (invalidCategories.length > 0) {
        throw new AppError(
            status.BAD_REQUEST,
            `The following category IDs are invalid or deleted: ${invalidCategories.join(", ")}`
        );
    }
};
