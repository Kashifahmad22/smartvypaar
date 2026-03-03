import {
  getDashboardStats,
  getLowStockProducts,
  getTopProducts,
  getUpcomingExpiry,
  getProfile,
  getFinancialSummary,
  getTrendAnalytics
} from "../services/api";

import { useEffect, useState } from "react";
import PerformanceChart from "../components/PerformanceChart";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [profile, setProfile] = useState(null);

  const [metric, setMetric] = useState("revenue");
  const [period, setPeriod] = useState("7d");
  const [chartData, setChartData] = useState([]);

  useEffect(() => { fetchInitial(); }, []);
  useEffect(() => { fetchTrend(); }, [metric, period]);

  const fetchInitial = async () => {
    const [
      dashboard,
      low,
      top,
      expiry,
      profileRes,
      financialRes
    ] = await Promise.all([
      getDashboardStats(),
      getLowStockProducts(),
      getTopProducts(),
      getUpcomingExpiry(),
      getProfile(),
      getFinancialSummary()
    ]);

    setStats(dashboard.data);
    setLowStock(low.data);
    setTopProducts(top.data);
    setExpiring(expiry.data);
    setProfile(profileRes.data);
    setFinancial(financialRes.data.data);
  };

  const fetchTrend = async () => {
    const res = await getTrendAnalytics(period);
    setChartData(res.data.data);
  };

  if (!stats || !financial || !profile) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-14 animate-fadeIn">

      {/* ================= BUSINESS HEADER ================= */}
      <div className="relative bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold break-words">
              {profile.shopName}
            </h2>

            <div className="text-xs sm:text-sm text-gray-500 space-y-1">
              <p>Owner: {profile.ownerName || "Not Added"}</p>
              <p>Phone: {profile.phoneNumber || "Not Added"}</p>
              <p>GST: {profile.gstNumber || "Not Added"}</p>
              <p className="break-words">
                {profile.shopAddress || "Address not added"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FINANCIAL STRIP ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatCard title="Receivables" value={`₹ ${financial.totalReceivables}`} />
        <StatCard title="Payables" value={`₹ ${financial.totalPayables}`} />
        <StatCard
          title="Net Position"
          value={`₹ ${financial.netPosition}`}
          valueColor={
            financial.netPosition >= 0
              ? "text-green-500"
              : "text-red-500"
          }
        />
        <StatCard title="Monthly Credit" value={`₹ ${financial.monthlyCredit}`} />
        <StatCard title="Monthly Debit" value={`₹ ${financial.monthlyDebit}`} />
      </div>

      {/* ================= TODAY KPIs ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Today Revenue" value={`₹ ${stats.todayRevenue}`} />
        <StatCard title="Today Profit" value={`₹ ${stats.todayProfit || 0}`} />
        <StatCard title="Today Sales" value={stats.todaySalesCount} />
        <StatCard title="Low Stock Items" value={stats.lowStockCount} />
      </div>

      {/* ================= AI LAB SMART INSIGHTS ================= */}
      <div
        onClick={() => window.location.href = "/insights"}
        className="relative group cursor-pointer"
      >
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-40 blur-xl animate-[pulse_4s_ease-in-out_infinite]"></div>

        <div className="relative rounded-3xl p-5 sm:p-6 lg:p-8 overflow-hidden border backdrop-blur-xl shadow-2xl bg-white/70 dark:bg-[#0b1120]/80 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.4)_1px,transparent_0)] [background-size:20px_20px]"></div>

          <div className="relative z-10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-lg sm:text-xl">
                  🤖
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold">
                  Smart Insights
                </h3>
              </div>

              <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                Live Intelligence
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <p>💰 Raw Makhana generated highest profit (₹778,440)</p>
              <p>📊 Estimated ₹1,616,081 revenue next 7 days</p>
              <p>📦 0 dead stock items</p>
              <p>⚠️ 1 products at stockout risk</p>
            </div>

            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Enter AI Intelligence →
            </div>
          </div>
        </div>
      </div>

      {/* ================= PERFORMANCE CHART ================= */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold">
            Performance Overview
          </h3>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="profit">Profit</option>
            </select>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <PerformanceChart data={chartData} metric={metric} />
        </div>
      </div>

      {/* ================= INVENTORY WIDGETS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        <Widget title="Low Stock Items">
          {lowStock.map(item => (
            <ProgressRow
              key={item._id}
              label={item.name}
              value={item.stockQuantity}
              percent={(item.stockQuantity / (item.reorderThreshold || 1)) * 100}
              color="bg-red-500"
            />
          ))}
        </Widget>

        <Widget title="Top Selling Products">
          {topProducts.map((item, index) => {
            const max = topProducts[0]?.totalSold || 1;
            return (
              <ProgressRow
                key={index}
                label={item._id?.name}
                value={item.totalSold}
                percent={(item.totalSold / max) * 100}
                color="bg-blue-500"
              />
            );
          })}
        </Widget>

        <Widget title="Expiring Soon">
          {expiring.map(item => (
            <div key={item._id} className="text-sm mb-3 break-words">
              {item.name}
            </div>
          ))}
        </Widget>
      </div>

    </div>
  );
}

/* ---------- Skeleton Loader ---------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
      <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({ title, value, valueColor = "" }) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p className={`text-xl sm:text-2xl font-semibold mt-3 ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

function Widget({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm">
      <h4 className="font-semibold mb-5 text-sm sm:text-base">{title}</h4>
      {children}
    </div>
  );
}

function ProgressRow({ label, value, percent, color }) {
  const safe = Math.min(100, Math.max(0, percent));

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs sm:text-sm mb-2">
        <span className="truncate pr-2">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard;