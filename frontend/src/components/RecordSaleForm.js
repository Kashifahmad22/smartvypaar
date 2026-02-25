import { useEffect, useState } from "react";
import { createSale, getAllProducts } from "../services/api";

function RecordSaleForm({ onSaleRecorded }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) return;

    try {
      await createSale({
        productId,
        quantity: Number(quantity),
      });

      setQuantity("");
      setProductId("");

      if (onSaleRecorded) onSaleRecorded();
    } catch (err) {
      console.error("Sale Error:", err);
      alert("Error recording sale");
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Record Sale
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">

        {/* Product Select */}
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          className="bg-[#1f2937] border border-gray-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} (Stock: {p.totalStock ?? 0})
            </option>
          ))}

        </select>

        {/* Quantity Input */}
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="1"
          className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-md"
        >
          Record Sale
        </button>

      </form>
    </div>
  );
}

export default RecordSaleForm;