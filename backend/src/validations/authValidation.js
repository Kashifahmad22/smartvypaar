const { z } = require("zod");

/*
===========================
REGISTER VALIDATION
===========================
*/
const registerSchema = z.object({
  shopName: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .max(100, "Shop name too long")
    .trim(),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number")
});

/*
===========================
LOGIN VALIDATION
===========================
*/
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required")
});

module.exports = {
  registerSchema,
  loginSchema
};