const { z } = require("zod");

/*
===========================
CREATE PRODUCT VALIDATION
(FMCG LEVEL)
===========================
*/

const createProductSchema = z.object({

  // ================= BASIC =================
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name too long")
    .trim(),

  brand: z.string().optional().nullable(),

  category: z.string().optional().nullable(),

  unit: z.string().optional().nullable(),

  packageSize: z.string().optional().nullable(),

  // ================= PRICING =================
  costPrice: z
    .coerce.number({
      invalid_type_error: "Cost price must be a number"
    })
    .positive("Cost price must be greater than 0"),

  sellingPrice: z
    .coerce.number({
      invalid_type_error: "Selling price must be a number"
    })
    .positive("Selling price must be greater than 0"),

  mrp: z
    .coerce.number({
      invalid_type_error: "MRP must be a number"
    })
    .positive("MRP must be greater than 0"),

  discount: z
    .coerce.number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),

  gstRate: z
    .coerce.number()
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100%")
    .optional()
    .default(0),

  hsnCode: z.string().optional().nullable(),

  // ================= STOCK =================
  stockQuantity: z
    .coerce.number({
      invalid_type_error: "Stock quantity must be a number"
    })
    .int("Stock quantity must be an integer")
    .nonnegative("Stock cannot be negative"),

  reorderThreshold: z
    .coerce.number({
      invalid_type_error: "Reorder threshold must be a number"
    })
    .int("Reorder threshold must be an integer")
    .nonnegative("Reorder threshold cannot be negative"),

  batchNumber: z.string().optional().nullable(),

  supplierName: z.string().optional().nullable(),

  purchaseDate: z
    .union([z.string(), z.null()])
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !isNaN(Date.parse(val));
      },
      "Invalid purchase date"
    ),

  expiryDate: z
    .union([z.string(), z.null()])
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !isNaN(Date.parse(val));
      },
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
    .coerce.number({
      invalid_type_error: "Quantity must be a number"
    })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0")
});


module.exports = {
  createProductSchema,
  restockSchema
};