import { z } from "zod";

export const userSignupSchema = z.object({
  id: z.string().default(""),
  firm: z.string().min(3).max(100).default("Test"),
  name: z.string().min(3).max(50),
  password: z.string().min(8).max(16),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(new RegExp("^[0-9]{10}$")).length(10),
});

export const userLoginSchema = z.object({
  password: z.string(),
  phoneNumber: z.string().regex(new RegExp("^[0-9]{10}$")).length(10),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  phoneNumber: z.string().regex(new RegExp("^[0-9]{10}$")).length(10),
});

export const cartProductSchema = z.object({
  productTypeId: z.string().cuid(),
  quantity: z.number().min(0).default(1),
});

export const userAddressSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string().regex(new RegExp("^[0-9]{10}$")).length(10),
  line1: z.string(),
  line2: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  pincode: z.string().length(6),
});

export const productSchema = z.object({
  name: z.string(),
  categoryId: z.string().cuid().optional(),
  availability: z.boolean().optional(),
  categoryName: z.string().optional(),
  createCategory: z.boolean().default(false),
});

export const unitSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const productTypeSchema = z.object({
  unitId: z.string(),
  productId: z.string().cuid(),
  price: z.number().min(0),
  stock: z.number().min(0).default(0),
  availability: z.boolean().default(true),
  unitName: z.string().optional(),
  unitDescription: z.string().optional(),
  createUnit: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string(),
});

export const orderSchema = z.object({
  addressId: z.string(),
});
