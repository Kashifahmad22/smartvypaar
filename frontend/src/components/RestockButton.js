import { useState } from "react";
import axios from "axios";

function RestockButton({ productId }) {
  const [quantity, setQuantity] = useState("");

  const handleRestock = async () => {
    if (!quantity) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/products/${productId}/restock`,
        { quantity: Number(quantity) }
      );

      window.location.reload();
    } catch (err) {
      console.error("Restock Error:", err);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-1 w-20 rounded"
      />
      <button
        onClick={handleRestock}
        className="bg-blue-500 text-white px-2 rounded"
      >
        +
      </button>
    </div>
  );
}

export default RestockButton;