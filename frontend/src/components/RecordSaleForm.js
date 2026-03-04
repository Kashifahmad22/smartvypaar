import { useEffect, useState } from "react";
import {
  createSale,
  getAllProducts,
  getParties,
  createParty,
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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getAllProducts(1, 100);
        setProducts(productRes.data.products || []);

        const customerRes = await getParties("CUSTOMER");
        setCustomers(customerRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  /* ================= AUTO CALCULATE ================= */
  useEffect(() => {
    const selectedProduct = products.find((p) => p._id === productId);

    if (selectedProduct && quantity > 0) {
      const price =
        selectedProduct.batches?.[0]?.sellingPrice || 0;
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

  /* ================= SUBMIT ================= */
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
          openingBalance: 0,
        });

        finalCustomerId = res.data.data._id;
      }

      await createSale({
        productId,
        quantity: Number(quantity),
        customerId: finalCustomerId || undefined,
        paymentReceived: Number(paymentReceived) || 0,
        paymentMethod,
        invoiceNumber,
      });

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
      console.error(err);
      alert("Error recording sale");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-0 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Record Sale
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create a sales entry and manage payment details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ================= PRODUCT SECTION ================= */}
        <div className="sv-card space-y-5">

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Product Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="sv-input w-full"
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
              className="sv-input w-full"
            />

          </div>

        </div>

        {/* ================= CUSTOMER SECTION ================= */}

        <div className="sv-card space-y-5">

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Customer Details
          </h3>

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
            className="sv-input w-full"
          >
            <option value="">Walk-in Customer</option>
            {customers.map((c) => (
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
                className="sv-input w-full"
              />

              <input
                type="text"
                placeholder="Phone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                className="sv-input w-full"
              />

            </div>

          )}

        </div>

        {/* ================= PAYMENT SECTION ================= */}

        <div className="sv-card space-y-5">

          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Payment Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

            <input
              type="number"
              placeholder="Payment Received"
              value={paymentReceived}
              onChange={(e) => setPaymentReceived(e.target.value)}
              min="0"
              className="sv-input w-full"
            />

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sv-input w-full"
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
              className="sv-input w-full"
            />

          </div>

        </div>

        {/* ================= SUMMARY ================= */}

        {calculatedAmount > 0 && (

          <div className="sv-card space-y-4 text-sm">

            <div className="flex items-center justify-between flex-wrap gap-2">

              <span className="text-gray-500">
                Total Amount
              </span>

              <span className="font-semibold text-base">
                ₹ {calculatedAmount}
              </span>

            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">

              <span className="text-gray-500">
                Payment Status
              </span>

              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {paymentStatus}
              </span>

            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">

              <span className="text-gray-500">
                Amount Due
              </span>

              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                ₹ {amountDue < 0 ? 0 : amountDue}
              </span>

            </div>

          </div>

        )}

        {/* ================= SUBMIT ================= */}

        <button
          type="submit"
          className="sv-btn-primary w-full py-3 text-base sm:text-sm"
        >
          Record Sale
        </button>

      </form>

    </div>
  );
}

export default RecordSaleForm;