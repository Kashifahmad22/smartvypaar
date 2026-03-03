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
        ...batchForm,
        costPrice: Number(batchForm.costPrice),
        sellingPrice: Number(batchForm.sellingPrice),
        mrp: Number(batchForm.mrp),
        quantity: Number(batchForm.quantity)
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
    <div className="space-y-6">

      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No products available.
        </p>
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
                  className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm"
                >

                  {/* HEADER */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stock: {product.totalStock} | Reorder: {product.reorderThreshold}
                      </p>

                      {expiringCount > 0 && (
                        <span className="inline-block mt-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-md">
                          {expiringCount} Expiring Soon
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isLow
                            ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                            : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                        }`}
                      >
                        {isLow ? "Low Stock" : "Healthy"}
                      </span>

                      <button
                        onClick={() =>
                          setExpandedProduct(
                            expandedProduct === product._id
                              ? null
                              : product._id
                          )
                        }
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      >
                        {expandedProduct === product._id ? "Hide" : "View"}
                      </button>

                      <button
                        onClick={() =>
                          setActiveProduct(
                            activeProduct === product._id
                              ? null
                              : product._id
                          )
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        Add Batch
                      </button>

                    </div>
                  </div>

                  {/* BATCHES */}
                  <AnimatePresence>
                    {expandedProduct === product._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6"
                      >
                        {product.batches.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No batches available.
                          </p>
                        ) : (
                          product.batches.map((batch) => {
                            const isExpired =
                              batch.expiryDate &&
                              new Date(batch.expiryDate) < new Date();

                            return (
                              <div
                                key={batch._id}
                                className={`p-4 rounded-xl border ${
                                  isExpired
                                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                }`}
                              >
                                <div className="grid sm:grid-cols-2 gap-4">

                                  <div className="space-y-1 text-sm">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      Batch: {batch.batchNumber}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                      Purchase: {new Date(batch.purchaseDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                      Expiry: {batch.expiryDate
                                        ? new Date(batch.expiryDate).toLocaleDateString()
                                        : "—"}
                                    </p>
                                  </div>

                                  <div className="text-sm space-y-1 sm:text-right">
                                    <p>Qty: {batch.quantity}</p>
                                    <p>Cost: ₹{batch.costPrice}</p>
                                    <p>Selling: ₹{batch.sellingPrice}</p>
                                    <p>MRP: ₹{batch.mrp}</p>
                                  </div>

                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                  <button
                                    onClick={() => handleEditBatch(batch)}
                                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                                  >
                                    Edit Qty
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBatch(batch._id)}
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ADD BATCH FORM */}
                  {activeProduct === product._id && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
                      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">

                        <h4 className="font-semibold mb-4">
                          Add New Batch
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { name: "batchNumber", placeholder: "Batch Number", type: "text" },
                            { name: "purchaseDate", type: "date" },
                            { name: "expiryDate", type: "date" },
                            { name: "costPrice", placeholder: "Cost Price", type: "number" },
                            { name: "sellingPrice", placeholder: "Selling Price", type: "number" },
                            { name: "mrp", placeholder: "MRP", type: "number" },
                            { name: "quantity", placeholder: "Quantity", type: "number" }
                          ].map((field) => (
                            <input
                              key={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              onChange={(e) =>
                                setBatchForm({
                                  ...batchForm,
                                  [field.name]: e.target.value
                                })
                              }
                              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          ))}

                          <button
                            onClick={() => handleBatchSubmit(product._id)}
                            className="lg:col-span-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
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

          {/* PAGINATION */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md disabled:opacity-50"
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