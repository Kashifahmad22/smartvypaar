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
    .positive("Quantity must be greater than 0")
});

module.exports = {
  createSaleSchema
};