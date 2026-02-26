import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllProducts,
  restockProduct,
  updateBatchQuantity,
  deleteBatch
} from "../services/api";

function ProductInventoryTable() {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [batchForm, setBatchForm] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchProducts = async (page) => {
    try {
      const res = await getAllProducts(page, limit);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleBatchSubmit = async (productId) => {
    try {
      await restockProduct(productId, {
        batchNumber: batchForm.batchNumber,
        purchaseDate: batchForm.purchaseDate,
        expiryDate: batchForm.expiryDate || null,
        costPrice: Number(batchForm.costPrice),
        sellingPrice: Number(batchForm.sellingPrice),
        mrp: Number(batchForm.mrp),
        quantity: Number(batchForm.quantity),
        supplierName: batchForm.supplierName || "",
        invoiceNumber: batchForm.invoiceNumber || ""
      });

      setActiveProduct(null);
      setBatchForm({});
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Batch Restock Error:", err);
    }
  };

  const handleEditBatch = async (batch) => {
    const newQty = prompt("Enter new quantity:", batch.quantity);
    if (newQty === null) return;

    try {
      await updateBatchQuantity(batch._id, {
        quantity: Number(newQty)
      });
      fetchProducts(currentPage);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Delete this batch?")) return;

    try {
      await deleteBatch(batchId);
      fetchProducts(currentPage);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Product Inventory
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-400">No products available.</p>
      ) : (
        <>
          <div className="space-y-6">
            {products.map((product) => {
              const isLow =
                product.totalStock <= product.reorderThreshold;

              const expiringCount = product.batches.filter((batch) => {
                if (!batch.expiryDate) return false;
                const today = new Date();
                const expiry = new Date(batch.expiryDate);
                const diff =
                  (expiry - today) / (1000 * 60 * 60 * 24);
                return diff <= 30 && diff >= 0;
              }).length;

              return (
                <div
                  key={product._id}
                  className="border border-gray-700 rounded-xl p-5 bg-[#0f172a]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {product.name}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        Stock: {product.totalStock} | Reorder:{" "}
                        {product.reorderThreshold}
                      </p>

                      {expiringCount > 0 && (
                        <span className="inline-block mt-2 text-xs bg-orange-600 px-2 py-1 rounded text-white">
                          {expiringCount} Expiring Soon
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isLow
                            ? "bg-red-900/40 text-red-400"
                            : "bg-green-900/40 text-green-400"
                        }`}
                      >
                        {isLow ? "Low Stock" : "Healthy"}
                      </span>

                      {/* Spring Animated Expand Button */}
                      <button
                        onClick={() =>
                          setExpandedProduct(
                            expandedProduct === product._id
                              ? null
                              : product._id
                          )
                        }
                        className="text-sm text-gray-300 hover:text-white flex items-center gap-1"
                      >
                        {expandedProduct === product._id ? "Hide" : "View"}

                        <motion.span
                          animate={{
                            rotate:
                              expandedProduct === product._id
                                ? 180
                                : 0
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          ▼
                        </motion.span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveProduct(
                            activeProduct === product._id
                              ? null
                              : product._id
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white text-sm"
                      >
                        Add Batch
                      </button>
                    </div>
                  </div>

                  {/* Spring Animated Batch Section */}
                  <AnimatePresence initial={false}>
                    {expandedProduct === product._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 18
                        }}
                        className="overflow-hidden mt-4 border-t border-gray-700 pt-4"
                      >
                        <div className="space-y-4">
                          {product.batches.length === 0 ? (
                            <p className="text-gray-400 text-sm">
                              No batches available.
                            </p>
                          ) : (
                            product.batches.map((batch) => {
                              const isExpired =
                                batch.expiryDate &&
                                new Date(batch.expiryDate) <
                                  new Date();

                              return (
                                <motion.div
                                  key={batch._id}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: 0.05
                                  }}
                                  className={`p-4 rounded-xl border ${
                                    isExpired
                                      ? "border-red-700 bg-red-900/20"
                                      : "border-gray-700 bg-[#1e293b]"
                                  }`}
                                >
                                  <div className="flex justify-between">
                                    <div className="space-y-1">
                                      <p className="text-white font-semibold">
                                        Batch: {batch.batchNumber}
                                      </p>

                                      <p className="text-gray-400 text-sm">
                                        Purchase:{" "}
                                        {new Date(
                                          batch.purchaseDate
                                        ).toLocaleDateString()}
                                      </p>

                                      <p className="text-gray-400 text-sm">
                                        Expiry:{" "}
                                        {batch.expiryDate
                                          ? new Date(
                                              batch.expiryDate
                                            ).toLocaleDateString()
                                          : "—"}
                                      </p>

                                      {isExpired && (
                                        <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                                          Expired
                                        </span>
                                      )}
                                    </div>

                                    <div className="text-right space-y-1">
                                      <p className="text-gray-300 text-sm">
                                        Qty: {batch.quantity}
                                      </p>
                                      <p className="text-gray-300 text-sm">
                                        Cost: ₹{batch.costPrice}
                                      </p>
                                      <p className="text-gray-300 text-sm">
                                        Selling: ₹{batch.sellingPrice}
                                      </p>
                                      <p className="text-gray-300 text-sm">
                                        MRP: ₹{batch.mrp}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4 flex gap-3">
                                    <button
                                      onClick={() =>
                                        handleEditBatch(batch)
                                      }
                                      className="text-xs bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white"
                                    >
                                      Edit Qty
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDeleteBatch(
                                          batch._id
                                        )
                                      }
                                      className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Add Batch Form */}
                  {activeProduct === product._id && (
                    <div className="mt-6 border-t border-gray-700 pt-6">
                      <div className="bg-[#111827] border border-gray-700 p-6 rounded-2xl shadow-inner">
                        <h4 className="text-white font-semibold mb-4 text-lg">
                          Add New Batch
                        </h4>

                        <div className="grid grid-cols-3 gap-4">
                          {[
                            {
                              name: "batchNumber",
                              placeholder: "Batch Number",
                              type: "text"
                            },
                            { name: "purchaseDate", type: "date" },
                            { name: "expiryDate", type: "date" },
                            {
                              name: "costPrice",
                              placeholder: "Cost Price",
                              type: "number"
                            },
                            {
                              name: "sellingPrice",
                              placeholder: "Selling Price",
                              type: "number"
                            },
                            {
                              name: "mrp",
                              placeholder: "MRP",
                              type: "number"
                            },
                            {
                              name: "quantity",
                              placeholder: "Quantity",
                              type: "number"
                            }
                          ].map((field) => (
                            <input
                              key={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              onChange={(e) =>
                                setBatchForm({
                                  ...batchForm,
                                  [field.name]:
                                    e.target.value
                                })
                              }
                              className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ))}

                          <button
                            onClick={() =>
                              handleBatchSubmit(
                                product._id
                              )
                            }
                            className="col-span-3 bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-semibold shadow-md"
                          >
                            Save Batch
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductInventoryTable;