

import { z } from "zod";

 const createCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string().min(1, "Slug is required").optional(),
        image: z.string().url("Image must be a valid URL").optional(),
        isDelete: z.boolean().default(false),
    }),
});

 const updateCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required").optional(),
        slug: z.string().min(1, "Slug is required").optional(),
        image: z.string().url("Image must be a valid URL").optional(),
        // isDelete: z.boolean().optional(),
    }),
});

export const categoryValidationSchema = {
    createCategoryValidation,
    updateCategoryValidation,
}
