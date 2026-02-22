import { useEffect, useState } from "react";
import axios from "axios";
import { getAllProducts } from "../services/api";

function ProductInventoryTable() {
  const [products, setProducts] = useState([]);
  const [restockQty, setRestockQty] = useState({});

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRestock = async (productId) => {
    const quantity = restockQty[productId];
    if (!quantity || quantity <= 0) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/products/${productId}/restock`,
        { quantity: Number(quantity) }
      );

      setRestockQty((prev) => ({
        ...prev,
        [productId]: ""
      }));

      fetchProducts();
    } catch (err) {
      console.error("Restock Error:", err);
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                <th className="py-3">Product</th>
                <th className="py-3">Selling Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Reorder Level</th>
                <th className="py-3">Status</th>
                <th className="py-3">Restock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const isLow =
                  product.stockQuantity <= product.reorderThreshold;

                return (
                  <tr
                    key={product._id}
                    className="border-b border-gray-800 hover:bg-[#1f2937] transition"
                  >
                    <td className="py-4 text-white font-medium">
                      {product.name}
                    </td>

                    <td className="py-4 text-gray-300">
                      ₹ {product.sellingPrice}
                    </td>

                    <td className="py-4 text-gray-300">
                      {product.stockQuantity}
                    </td>

                    <td className="py-4 text-gray-300">
                      {product.reorderThreshold}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isLow
                            ? "bg-red-900/40 text-red-400"
                            : "bg-green-900/40 text-green-400"
                        }`}
                      >
                        {isLow ? "Low Stock" : "Healthy"}
                      </span>
                    </td>

                    {/* Restock */}
                    <td className="py-4">
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={restockQty[product._id] || ""}
                          onChange={(e) =>
                            setRestockQty({
                              ...restockQty,
                              [product._id]: e.target.value
                            })
                          }
                          className="bg-[#1f2937] border border-gray-600 text-white px-2 py-1 w-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                          onClick={() =>
                            handleRestock(product._id)
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white font-semibold transition"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default ProductInventoryTable;