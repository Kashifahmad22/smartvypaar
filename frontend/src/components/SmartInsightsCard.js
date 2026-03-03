import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SmartInsightsCard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get("/insights/summary");
        setData(res.data.data);
      } catch (err) {
        console.error("Insights fetch error:", err);
      }
    };

    fetchInsights();
  }, []);

  // ================= LOADING STATE =================
  if (!data) {
    return (
      <div className="relative mt-6 rounded-3xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse">
        <div className="bg-gray-900 rounded-3xl p-6 text-gray-400 text-sm">
          🧠 Analyzing business intelligence...
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate("/insights")}
      className="relative mt-6 cursor-pointer group transition-all duration-500 hover:scale-[1.02]"
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition duration-500 blur-sm"></div>

      {/* Main Card Container */}
      <div className="relative bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl overflow-hidden">

        {/* AI Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition duration-700"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            🧠 Smart Insights
          </h2>

          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Live Intelligence
          </span>
        </div>

        {/* Bullet Insights */}
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="transition duration-300 group-hover:text-white">
            💰 <span className="font-medium text-white">
              {data.topMarginProduct?.name || "N/A"}
            </span>{" "}
            generated highest profit (₹
            {(data.topMarginProduct?.profit || 0).toLocaleString()})
          </li>

          <li className="transition duration-300 group-hover:text-white">
            📊 Estimated ₹
            {(data.projected7DayRevenue || 0).toLocaleString()} revenue next 7 days
          </li>

          <li className="transition duration-300 group-hover:text-white">
            🧊 {data.deadStockCount || 0} dead stock items
          </li>

          <li className="transition duration-300 group-hover:text-white">
            ⚠ {data.stockoutRisks || 0} products at stockout risk
          </li>
        </ul>

        {/* CTA */}
        <div className="mt-6 text-sm text-blue-400 group-hover:text-blue-300 transition">
          View Detailed Insights →
        </div>
      </div>
    </div>
  );
};

export default SmartInsightsCard;