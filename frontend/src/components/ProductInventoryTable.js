import { useEffect, useState } from "react";
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

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      fetchProducts();
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

      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Delete this batch?")) return;

    try {
      await deleteBatch(batchId);
      fetchProducts();
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

                    <button
                      onClick={() =>
                        setExpandedProduct(
                          expandedProduct === product._id
                            ? null
                            : product._id
                        )
                      }
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {expandedProduct === product._id
                        ? "Hide Batches ▲"
                        : "View Batches ▼"}
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

                {/* Batch Display */}
                {expandedProduct === product._id && (
                  <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
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
                          <div
                            key={batch._id}
                            className={`p-4 rounded-lg border ${
                              isExpired
                                ? "border-red-700 bg-red-900/20 opacity-60"
                                : "border-gray-700 bg-[#1e293b]"
                            }`}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="text-white font-medium">
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
                              </div>

                              <div className="text-right text-sm text-gray-300">
                                <p>Qty: {batch.quantity}</p>
                                <p>Cost: ₹{batch.costPrice}</p>
                                <p>Selling: ₹{batch.sellingPrice}</p>
                                <p>MRP: ₹{batch.mrp}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-3 flex gap-3">
                              <button
                                onClick={() =>
                                  handleEditBatch(batch)
                                }
                                className="text-xs bg-yellow-600 px-2 py-1 rounded text-white"
                              >
                                Edit Qty
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteBatch(batch._id)
                                }
                                className="text-xs bg-red-600 px-2 py-1 rounded text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Add Batch Form */}
                {activeProduct === product._id && (
                  <div className="mt-5 grid grid-cols-3 gap-4">
                    <input
                      placeholder="Batch Number"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          batchNumber: e.target.value
                        })
                      }
                      className="dark-input"
                    />
                    <input
                      type="date"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          purchaseDate: e.target.value
                        })
                      }
                      className="dark-input"
                    />
                    <input
                      type="date"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          expiryDate: e.target.value
                        })
                      }
                      className="dark-input"
                    />
                    <input
                      type="number"
                      placeholder="Cost Price"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          costPrice: e.target.value
                        })
                      }
                      className="dark-input"
                    />
                    <input
                      type="number"
                      placeholder="Selling Price"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          sellingPrice: e.target.value
                        })
                      }
                      className="dark-input"
                    />
                    <input
                      type="number"
                      placeholder="MRP"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          mrp: e.target.value
                        })
                      }
                      className="dark-input"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      onChange={(e) =>
                        setBatchForm({
                          ...batchForm,
                          quantity: e.target.value
                        })
                      }
                      className="dark-input"
                    />

                    <button
                      onClick={() =>
                        handleBatchSubmit(product._id)
                      }
                      className="col-span-3 bg-green-600 hover:bg-green-700 py-2 rounded-xl text-white font-semibold"
                    >
                      Save Batch
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductInventoryTable;