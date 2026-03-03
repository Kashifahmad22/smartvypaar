import { useEffect, useState } from "react";
import {
  createSale,
  getAllProducts,
  getParties,
  createParty
} from "../services/api";

function RecordSaleForm({ onSaleRecorded }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [paymentReceived, setPaymentReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getAllProducts(1, 100);
        setProducts(productRes.data.products);

        const customerRes = await getParties("CUSTOMER");
        setCustomers(customerRes.data.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // AUTO CALCULATE
  useEffect(() => {
    const selectedProduct = products.find(p => p._id === productId);

    if (selectedProduct && quantity > 0) {
      const price = selectedProduct.batches?.[0]?.sellingPrice || 0;
      setCalculatedAmount(price * quantity);
    } else {
      setCalculatedAmount(0);
    }
  }, [productId, quantity, products]);

  const amountPaid = Number(paymentReceived) || 0;
  const amountDue = calculatedAmount - amountPaid;

  let paymentStatus = "UNPAID";
  if (calculatedAmount > 0) {
    if (amountDue === 0) paymentStatus = "PAID";
    else if (amountPaid > 0) paymentStatus = "PARTIAL";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) return;

    try {
      let finalCustomerId = customerId;

      if (showNewCustomer && newCustomerName) {
        const res = await createParty({
          name: newCustomerName,
          phone: newCustomerPhone,
          type: "CUSTOMER",
          openingBalance: 0
        });
        finalCustomerId = res.data.data._id;
      }

      await createSale({
        productId,
        quantity: Number(quantity),
        customerId: finalCustomerId || undefined,
        paymentReceived: Number(paymentReceived) || 0,
        paymentMethod,
        invoiceNumber
      });

      // Reset
      setQuantity("");
      setProductId("");
      setCustomerId("");
      setPaymentReceived("");
      setInvoiceNumber("");
      setShowNewCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");

      if (onSaleRecorded) onSaleRecorded();

    } catch (err) {
      console.error("Sale Error:", err);
      alert("Error recording sale");
    }
  };

  return (
    <div className="max-w-5xl mx-auto sv-card space-y-10">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Record Sale
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Create a sales entry and manage payment details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* PRODUCT + QUANTITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="sv-input"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (Stock: {p.totalStock ?? 0})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
            className="sv-input"
          />
        </div>

        {/* CUSTOMER */}
        <div className="space-y-4">
          <select
            value={customerId}
            onChange={(e) => {
              if (e.target.value === "NEW") {
                setShowNewCustomer(true);
                setCustomerId("");
              } else {
                setCustomerId(e.target.value);
                setShowNewCustomer(false);
              }
            }}
            className="sv-input"
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
            <option value="NEW">+ Add New Customer</option>
          </select>

          {showNewCustomer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="sv-input"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                className="sv-input"
              />
            </div>
          )}
        </div>

        {/* PAYMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <input
            type="number"
            placeholder="Payment Received"
            value={paymentReceived}
            onChange={(e) => setPaymentReceived(e.target.value)}
            min="0"
            className="sv-input"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="sv-input"
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK">Bank</option>
            <option value="CARD">Card</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            type="text"
            placeholder="Invoice Number (Optional)"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="sv-input"
          />
        </div>

        {/* SUMMARY */}
        {calculatedAmount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl text-sm space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Total Amount: <span className="font-semibold text-gray-900 dark:text-white">₹ {calculatedAmount}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Payment Status: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{paymentStatus}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Amount Due: <span className="font-semibold text-yellow-600 dark:text-yellow-400">₹ {amountDue < 0 ? 0 : amountDue}</span>
            </p>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="sv-btn-primary w-full"
        >
          Record Sale
        </button>

      </form>
    </div>
  );
}

export default RecordSaleForm;