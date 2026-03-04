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

  // ================= PAGINATION =================
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentSales = sales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="sv-card space-y-8">

      {/* ================= HEADER ================= */}

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Sales History
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          View all recorded sales transactions.
        </p>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {sales.length === 0 ? (

        <div className="text-gray-500 dark:text-gray-400 text-sm">
          No sales recorded yet.
        </div>

      ) : (

        <>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">

            <table className="min-w-[520px] w-full text-left text-sm">

              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">

                <tr>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Product
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Quantity
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Total
                  </th>

                  <th className="px-4 py-3 whitespace-nowrap">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentSales.map((sale) => (

                  <tr
                    key={sale._id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >

                    {/* PRODUCT */}

                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">

                      <div className="max-w-[220px] truncate">
                        {sale.product?.name || "Deleted Product"}
                      </div>

                    </td>

                    {/* QUANTITY */}

                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {sale.quantity}
                    </td>

                    {/* TOTAL */}

                    <td className="px-4 py-4 font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                      ₹ {sale.totalAmount}
                    </td>

                    {/* DATE */}

                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm whitespace-nowrap">

                      {new Date(sale.createdAt).toLocaleString()}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= PAGINATION ================= */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="text-sm text-gray-500 dark:text-gray-400">

              Page {currentPage} of {totalPages}

            </div>

            <div className="flex flex-wrap justify-center gap-3">

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