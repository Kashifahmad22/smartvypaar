import { useState } from "react";
import { createProduct } from "../services/api";

function AddProductForm({ onProductAdded }) {

  const initialState = {
    // Basic
    name: "",
    brand: "",
    category: "",
    unit: "pcs",
    packageSize: "",

    // Pricing
    costPrice: "",
    sellingPrice: "",
    mrp: "",
    discount: "",
    gstRate: "",
    hsnCode: "",

    // Stock
    stockQuantity: "",
    reorderThreshold: "",
    batchNumber: "",
    purchaseDate: "",
    expiryDate: "",
    supplierName: ""
  };

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createProduct({
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      subcategory: form.subcategory,
      barcode: form.barcode,
      sku: form.sku,
      unit: form.unit,
      packageSize: form.packageSize,
      reorderThreshold: Number(form.reorderThreshold),

      batchNumber: form.batchNumber,
      purchaseDate: form.purchaseDate,
      expiryDate: form.expiryDate || null,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      mrp: Number(form.mrp),
      quantity: Number(form.stockQuantity), // ✅ FIXED
      supplierName: form.supplierName,
      invoiceNumber: form.invoiceNumber
    });

    setForm(initialState);

    if (onProductAdded) onProductAdded();

  } catch (err) {
    console.error("Add Product Error:", err);
  }
};

  return (
    <div className="max-w-6xl mx-auto bg-[#111827] border border-gray-700 p-10 rounded-3xl shadow-xl space-y-10">

      <h2 className="text-3xl font-bold text-white">
        Add FMCG Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ================= BASIC DETAILS ================= */}
        <Section title="Basic Details">
          <Grid>
            <InputField name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
            <InputField name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
            <InputField name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <InputField name="packageSize" placeholder="Package Size (e.g. 500g)" value={form.packageSize} onChange={handleChange} />

            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="bg-[#1f2937] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kg</option>
              <option value="g">Gram</option>
              <option value="ltr">Litre</option>
              <option value="ml">ML</option>
              <option value="box">Box</option>
            </select>
          </Grid>
        </Section>

        {/* ================= PRICING ================= */}
        <Section title="Pricing">
          <Grid>
            <InputField type="number" name="costPrice" placeholder="Cost Price" value={form.costPrice} onChange={handleChange} required />
            <InputField type="number" name="sellingPrice" placeholder="Selling Price" value={form.sellingPrice} onChange={handleChange} required />
            <InputField type="number" name="mrp" placeholder="MRP" value={form.mrp} onChange={handleChange} required />
            <InputField type="number" name="discount" placeholder="Discount (%)" value={form.discount} onChange={handleChange} />
            <InputField type="number" name="gstRate" placeholder="GST (%)" value={form.gstRate} onChange={handleChange} />
            <InputField name="hsnCode" placeholder="HSN Code" value={form.hsnCode} onChange={handleChange} />
          </Grid>
        </Section>

        {/* ================= STOCK & BATCH ================= */}
        <Section title="Stock & Batch Information">
          <Grid>
            <InputField type="number" name="stockQuantity" placeholder="Opening Stock" value={form.stockQuantity} onChange={handleChange} required />
            <InputField type="number" name="reorderThreshold" placeholder="Reorder Level" value={form.reorderThreshold} onChange={handleChange} required />
            <InputField name="batchNumber" placeholder="Batch Number" value={form.batchNumber} onChange={handleChange} />
            <InputField name="supplierName" placeholder="Supplier Name" value={form.supplierName} onChange={handleChange} />
            <InputField type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
            <InputField type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
          </Grid>
        </Section>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition shadow-lg text-lg"
        >
          Add Product
        </button>

      </form>
    </div>
  );
}


/* ---------- REUSABLE COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-lg font-semibold border-b border-gray-700 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

function InputField({ type = "text", name, placeholder, value, onChange, required }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="bg-[#1f2937] border border-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
    />
  );
}

export default AddProductForm;