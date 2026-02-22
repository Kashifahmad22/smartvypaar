import { useState } from "react";
import { createProduct } from "../services/api";

function AddProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    reorderThreshold: "",
    expiryDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     await createProduct({
  name: form.name,
  costPrice: Number(form.costPrice),
  sellingPrice: Number(form.sellingPrice),
  stockQuantity: Number(form.stockQuantity),
  reorderThreshold: Number(form.reorderThreshold),
  expiryDate: form.expiryDate || null
});

      setForm({
        name: "",
        costPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        reorderThreshold: "",
        expiryDate: ""
      });

      if (onProductAdded) onProductAdded();

    } catch (err) {
      console.error("Add Product Error:", err);
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">

        <InputField
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <InputField
          type="number"
          name="costPrice"
          placeholder="Cost Price"
          value={form.costPrice}
          onChange={handleChange}
          required
        />

        <InputField
          type="number"
          name="sellingPrice"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={handleChange}
          required
        />

        <InputField
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
          required
        />

        <InputField
          type="number"
          name="reorderThreshold"
          placeholder="Reorder Threshold"
          value={form.reorderThreshold}
          onChange={handleChange}
          required
        />

        <InputField
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
        >
          Add Product
        </button>

      </form>
    </div>
  );
}

/* Reusable dark input */
function InputField({ type, name, placeholder, value, onChange, required }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
}

export default AddProductForm;