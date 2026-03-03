import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { getAllSales } from "../services/api";

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await getAllSales();
        setSales(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSales();
  }, []);

  /* ================= FILTER ================= */
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);

      const matchesSearch =
        sale.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        sale.customer?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || sale.paymentStatus === statusFilter;

      const matchesFrom = !fromDate || saleDate >= new Date(fromDate);

      const matchesTo =
        !toDate || saleDate <= new Date(toDate + "T23:59:59");

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [sales, search, statusFilter, fromDate, toDate]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentSales = filteredSales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages || 1));

  /* ================= CSV ================= */
  const exportCSV = () => {
    if (!filteredSales.length) return;

    const headers = [
      "Date",
      "Product",
      "Customer",
      "Total",
      "Paid",
      "Due",
      "Status",
    ];

    const rows = filteredSales.map((sale) => {
      const paid = sale.paymentReceived || 0;
      const due = sale.totalAmount - paid;

      return [
        new Date(sale.createdAt).toLocaleDateString(),
        sale.product?.name || "Deleted Product",
        sale.customer?.name || "Walk-in",
        sale.totalAmount,
        paid,
        due,
        sale.paymentStatus,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "sales-history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusStyles = {
    PAID:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    PARTIAL:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    UNPAID:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Sales History
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Filter, analyze and export sales data.
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="sv-card space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Product or customer name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="sv-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Payment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="sv-input"
            >
              <option value="ALL">All</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={exportCSV}
              className="sv-btn-primary w-full md:w-auto"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
            Date Range
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="sv-input pr-10"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="sv-input pr-10"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block sv-card p-0 overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            No matching sales found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr className="text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Paid</th>
                    <th className="px-6 py-4 text-left">Due</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentSales.map((sale) => {
                    const paid = sale.paymentReceived || 0;
                    const due = sale.totalAmount - paid;

                    return (
                      <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td className="px-6 py-4">
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {sale.product?.name || "Deleted Product"}
                        </td>
                        <td className="px-6 py-4">
                          {sale.customer?.name || "Walk-in"}
                        </td>
                        <td className="px-6 py-4">₹ {sale.totalAmount}</td>
                        <td className="px-6 py-4 text-green-600">₹ {paid}</td>
                        <td className="px-6 py-4 text-yellow-600">₹ {due}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusStyles[sale.paymentStatus] ||
                            statusStyles.UNPAID
                          }`}>
                            {sale.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goPrev={goPrev}
              goNext={goNext}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              totalItems={filteredSales.length}
            />
          </>
        )}
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {currentSales.map((sale) => {
          const paid = sale.paymentReceived || 0;
          const due = sale.totalAmount - paid;

          return (
            <div key={sale._id} className="sv-card space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  statusStyles[sale.paymentStatus] ||
                  statusStyles.UNPAID
                }`}>
                  {sale.paymentStatus}
                </span>
              </div>

              <div className="font-medium">
                {sale.product?.name || "Deleted Product"}
              </div>

              <div className="text-sm text-gray-500">
                {sale.customer?.name || "Walk-in"}
              </div>

              <div className="grid grid-cols-3 text-sm pt-2">
                <div>
                  <p className="text-gray-400">Total</p>
                  <p>₹ {sale.totalAmount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Paid</p>
                  <p className="text-green-600">₹ {paid}</p>
                </div>
                <div>
                  <p className="text-gray-400">Due</p>
                  <p className="text-yellow-600">₹ {due}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSales.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goPrev={goPrev}
            goNext={goNext}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSales.length}
          />
        )}
      </div>
    </div>
  );
}

/* ================= PAGINATION COMPONENT ================= */

function Pagination({
  currentPage,
  totalPages,
  goPrev,
  goNext,
  startIndex,
  itemsPerPage,
  totalItems,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
      <div>
        Showing {startIndex + 1}–
        {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40"
        >
          Prev
        </button>
        <span>
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={goNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SalesHistory;