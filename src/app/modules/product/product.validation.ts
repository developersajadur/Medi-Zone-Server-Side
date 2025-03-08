import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Product description is required'),
    price: z
      .number()
      .min(0, 'Price cannot be negative')
      .refine((value) => value >= 0, {
        message: 'Price cannot be negative',
      }),
    stock: z
      .number()
      .min(0, 'Stock cannot be negative')
      .refine((value) => value >= 0, {
        message: 'Stock cannot be negative',
      }),
    requiresPrescription: z.boolean(),
    manufacturer: z.object({
      name: z.string().min(1, 'Manufacturer name is required'),
      address: z.string().min(1, 'Manufacturer address is required'),
      contact: z.string().min(1, 'Manufacturer contact is required'),
    }),
    expiryDate: z.string(),
    isDeleted: z.boolean().default(false),
    image: z.string().min(1, 'Product images are required').optional(),
  }),
});




const updateProductValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    description: z.string().min(1, 'Product description is required').optional(),
    price: z
      .number()
      .min(0, 'Price cannot be negative')
      .refine((value) => value >= 0, {
        message: 'Price cannot be negative',
      }).optional(),
    stock: z
      .number()
      .min(0, 'Stock cannot be negative')
      .refine((value) => value >= 0, {
        message: 'Stock cannot be negative',
      }).optional(),
    requiresPrescription: z.boolean().optional(),
    manufacturer: z.object({
      name: z.string().min(1, 'Manufacturer name is required'),
      address: z.string().min(1, 'Manufacturer address is required'),
      contact: z.string().min(1, 'Manufacturer contact is required'),
    }).optional(),
    expiryDate: z.string().optional(),
    isDeleted: z.boolean().default(false).optional(),
    image: z.string().min(1, 'Product images are required').optional(),
  }),
});

export const ProductValidationSchema = {
  createProductValidation,
  updateProductValidation
};
