import { useState } from "react";
import { createProduct } from "../services/api";

function AddProductForm({ onProductAdded }) {

  const initialState = {
    name: "",
    brand: "",
    category: "",
    unit: "pcs",
    packageSize: "",
    costPrice: "",
    sellingPrice: "",
    mrp: "",
    discount: "",
    gstRate: "",
    hsnCode: "",
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
        quantity: Number(form.stockQuantity),
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
    <div className="max-w-6xl mx-auto bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Add Product
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Register a new product with pricing, tax and stock details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">

        {/* BASIC DETAILS */}
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
              className="
                w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
                bg-gray-100 dark:bg-gray-800
                border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              "
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

        {/* PRICING */}
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

        {/* STOCK & BATCH */}
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

        {/* SUBMIT BUTTON */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition shadow-sm text-base sm:text-lg"
          >
            Add Product
          </button>
        </div>

      </form>
    </div>
  );
}


/* ---------- REUSABLE COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {children}
    </div>
  );
}

function InputField({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="
        w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
        bg-gray-100 dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
      "
    />
  );
}

export default AddProductForm;