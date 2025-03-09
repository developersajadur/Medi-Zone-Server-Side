import { z } from 'zod';

// Define the Zod schema for user validation
const createUserValidation = z.object({
  body: z.object({
    fullName: z.string().min(1, { message: 'Name is required' }),
    phoneNumber: z.union([
      z
        .string()
        .min(1, { message: 'Number is required' })
        .regex(/^\d{11}$/, {
          message: 'Phone number must be exactly 11 digits.',
        }),
      z.number().min(1, { message: 'Number is required' }), // Apply the min check for number
    ]),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    role: z
      .enum(['admin', 'customer'], { message: 'Invalid role' })
      .default('customer'),
    isBlocked: z.boolean().default(false), // Make carts optional
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
});


const updateUserValidation = z.object({
  body: z.object({
    fullName: z.string().min(1, { message: 'Name is required' }).optional(),
    phoneNumber: z.union([
      z
        .string()
        .min(1, { message: 'Number is required' })
        .regex(/^\d{11}$/, {
          message: 'Phone number must be exactly 11 digits.',
        }),
      z.number().min(1, { message: 'Number is required' }), 
    ]).optional(),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' }).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
});


export const UserValidationSchema = {
  createUserValidation,
  updateUserValidation,
};
