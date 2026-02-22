import { useEffect, useState } from "react";
import { getAllSales } from "../services/api";

function SalesHistoryTable() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await getAllSales();
      setSales(res.data);
    };
    fetchSales();
  }, []);

  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Sales History
      </h2>

      {sales.length === 0 ? (
        <p className="text-gray-400">No sales recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                <th className="py-3">Product</th>
                <th className="py-3">Quantity</th>
                <th className="py-3">Total</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="border-b border-gray-800 hover:bg-[#1f2937] transition"
                >
                  <td className="py-4 text-white font-medium">
                    {sale.product?.name || "Deleted Product"}
                  </td>

                  <td className="py-4 text-gray-300">
                    {sale.quantity}
                  </td>

                  <td className="py-4 text-green-400 font-semibold">
                    ₹ {sale.totalAmount}
                  </td>

                  <td className="py-4 text-gray-400 text-sm">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SalesHistoryTable;