import {
  getDashboardStats,
  getLowStockProducts,
  getTopProducts,
  getUpcomingExpiry,
  getWeeklyProfit,
  getBusinessHealth
} from "../services/api";

import { useEffect, useState } from "react";
import RevenueChart from "../components/RevenueChart";
import ProfitChart from "../components/ProfitChart";
import BusinessHealthCard from "../components/BusinessHealthCard";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await getDashboardStats();
        const low = await getLowStockProducts();
        const top = await getTopProducts();
        const expiry = await getUpcomingExpiry();
        const profit = await getWeeklyProfit();
        const healthRes = await getBusinessHealth();

        setStats(dashboard.data);
        setLowStock(low.data);
        setTopProducts(top.data);
        setExpiring(expiry.data);
        setProfitData(profit.data);
        setHealth(healthRes.data);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to load dashboard data.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-red-400 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-gray-400 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-14">

      {/* Business Health */}
      {health && <BusinessHealthCard data={health} />}

      <h1 className="text-4xl font-bold text-white">
        Dashboard Overview
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-8">

        <DarkCard
          title="Today Revenue"
          value={`₹ ${stats.todayRevenue}`}
          color="text-green-400"
        />

        <DarkCard
          title="Today Profit"
          value={`₹ ${stats.todayProfit || 0}`}
          color="text-emerald-400"
        />

        <DarkCard
          title="Today Sales"
          value={stats.todaySalesCount}
        />

        <DarkCard
          title="Total Products"
          value={stats.totalProducts}
        />

        <DarkCard
          title="Low Stock"
          value={stats.lowStockCount}
          color="text-red-400"
        />

      </div>

      {/* Revenue Chart */}
      <DarkSection>
        <RevenueChart data={stats.weeklyData || []} />
      </DarkSection>

      {/* Profit Chart */}
      <DarkSection>
        <ProfitChart data={profitData || []} />
      </DarkSection>

      {/* Widgets */}
      <div className="grid grid-cols-3 gap-8">

        {/* Low Stock */}
        <DarkWidget title="Low Stock Items">
          {lowStock.length === 0 ? (
            <p className="text-gray-400 text-sm">
              All items healthy
            </p>
          ) : (
            lowStock.map(item => {
              const percent = Math.max(
                5,
                (item.stockQuantity / item.reorderThreshold) * 100
              );

              return (
                <ProgressRow
                  key={item._id}
                  label={item.name}
                  value={item.stockQuantity}
                  percent={percent}
                  color="bg-red-500"
                />
              );
            })
          )}
        </DarkWidget>

        {/* Top Selling */}
        <DarkWidget title="Top Selling Products">
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No sales yet
            </p>
          ) : (
            topProducts.map((item, index) => {
              const max = topProducts[0]?.totalSold || 1;
              const percent = (item.totalSold / max) * 100;

              return (
                <ProgressRow
                  key={index}
                  label={item._id?.name}
                  value={item.totalSold}
                  percent={percent}
                  color="bg-blue-500"
                />
              );
            })
          )}
        </DarkWidget>

        {/* Expiring */}
        <DarkWidget title="Expiring Soon">
          {expiring.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No upcoming expiry
            </p>
          ) : (
            expiring.map(item => (
              <div
                key={item._id}
                className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg"
              >
                <p className="text-white text-sm font-medium">
                  {item.name}
                </p>
                <p className="text-xs text-red-400">
                  Expires on{" "}
                  {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </DarkWidget>

      </div>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function DarkCard({ title, value, color = "text-white" }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-2xl shadow-lg">
      <p className="text-xs uppercase text-gray-400 tracking-wider font-semibold">
        {title}
      </p>
      <p className={`text-3xl mt-3 font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

function DarkSection({ children }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-lg">
      {children}
    </div>
  );
}

function DarkWidget({ title, children }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-2xl shadow-lg">
      <h3 className="text-white font-semibold mb-6">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProgressRow({ label, value, percent, color }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard;