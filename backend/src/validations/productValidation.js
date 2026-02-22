const { z } = require("zod");

/*
===========================
CREATE PRODUCT VALIDATION
===========================
*/
const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name too long")
    .trim(),

  costPrice: z
    .number({ invalid_type_error: "Cost price must be a number" })
    .positive("Cost price must be greater than 0"),

  sellingPrice: z
    .number({ invalid_type_error: "Selling price must be a number" })
    .positive("Selling price must be greater than 0"),

  stockQuantity: z
    .number({ invalid_type_error: "Stock quantity must be a number" })
    .int("Stock quantity must be an integer")
    .nonnegative("Stock cannot be negative"),

  reorderThreshold: z
    .number({ invalid_type_error: "Reorder threshold must be a number" })
    .int("Reorder threshold must be an integer")
    .nonnegative("Reorder threshold cannot be negative"),

  expiryDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Invalid expiry date"
    )
});

/*
===========================
RESTOCK VALIDATION
===========================
*/
const restockSchema = z.object({
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0")
});

module.exports = {
  createProductSchema,
  restockSchema
};