import { useEffect, useState } from "react";
import { getAllSales } from "../services/api";

function SalesHistoryTable() {
  const [sales, setSales] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await getAllSales();
        setSales(res.data);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };

    fetchSales();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = sales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="sv-card space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Sales History
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          View all recorded sales transactions.
        </p>
      </div>

      {sales.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          No sales recorded yet.
        </div>
      ) : (
        <>
          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">

            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody>

                {currentSales.map((sale) => (
                  <tr
                    key={sale._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {sale.product?.name || "Deleted Product"}
                    </td>

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {sale.quantity}
                    </td>

                    <td className="px-4 py-4 font-semibold text-green-600 dark:text-green-400">
                      ₹ {sale.totalAmount}
                    </td>

                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex gap-3">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Next
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalesHistoryTable;