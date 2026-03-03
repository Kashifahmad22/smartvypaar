const { z } = require("zod");

/*
===========================
CREATE SALE VALIDATION
===========================
*/
const createSaleSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required"),

  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),

  customerId: z
    .string()
    .optional(),

  paymentReceived: z
    .number({ invalid_type_error: "Payment must be a number" })
    .nonnegative("Payment cannot be negative")
    .optional(),

  paymentMethod: z
    .enum(["CASH", "UPI", "BANK", "CARD", "OTHER"])
    .optional(),

  taxableAmount: z
    .number()
    .nonnegative()
    .optional(),

  gstRate: z
    .number()
    .nonnegative()
    .optional(),

  gstAmount: z
    .number()
    .nonnegative()
    .optional(),

  invoiceNumber: z
    .string()
    .optional()
});

module.exports = {
  createSaleSchema
};