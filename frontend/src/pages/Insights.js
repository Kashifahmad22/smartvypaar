import { useEffect, useState } from "react";
import api from "../services/api";

function Insights() {
  const [summary, setSummary] = useState(null);
  const [reorder, setReorder] = useState([]);
  const [velocity, setVelocity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [summaryRes, reorderRes, velocityRes] =
          await Promise.all([
            api.get("/insights/summary"),
            api.get("/reorder/recommendations"),
            api.get("/reorder/velocity")
          ]);

        setSummary(summaryRes.data.data);
        setReorder(reorderRes.data.data || []);
        setVelocity(velocityRes.data.data || []);
      } catch (err) {
        console.error("Insights fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400 text-lg">
        Loading Insights...
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* ================= EXECUTIVE SUMMARY ================= */}
      {summary && (
        <div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-white mb-6">
            🧠 Business Intelligence Overview
          </h1>

          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-300">
            <InsightStat
              label="Stockout Risks"
              value={summary.stockoutRisks}
              color="text-red-400"
            />
            <InsightStat
              label="Dead Stock"
              value={summary.deadStockCount}
              color="text-yellow-400"
            />
            <InsightStat
              label="Slow Moving"
              value={summary.slowMovingCount}
              color="text-blue-400"
            />
            <InsightStat
              label="Fast Moving"
              value={summary.fastMovingCount}
              color="text-green-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <InsightStat
              label="Total Inventory Value"
              value={`₹ ${summary.inventoryValue?.toLocaleString()}`}
              color="text-purple-400"
            />
            <InsightStat
              label="Dead Stock Value"
              value={`₹ ${summary.deadStockValue?.toLocaleString()}`}
              color="text-red-500"
            />
          </div>

          <div className="mt-8">
            <InsightStat
              label="7-Day Revenue Forecast"
              value={`₹ ${summary.projected7DayRevenue?.toLocaleString()}`}
              color="text-emerald-400"
            />
          </div>
        </div>
      )}

      {/* ================= TOP MARGIN PRODUCTS ================= */}
      {summary?.top3MarginProducts?.length > 0 && (
        <Section title="💰 Top 3 Margin Contributors (Last 30 Days)">
          {summary.top3MarginProducts.map((item, index) => (
            <TableRow
              key={index}
              title={item.name}
              subtitle="30 Day Profit"
              right={`₹ ${item.profit.toLocaleString()}`}
            />
          ))}
        </Section>
      )}

      {/* ================= REORDER RISK ================= */}
      <Section title="📦 Reorder Risk (Sorted by Urgency)">
        {reorder.length === 0 ? (
          <Empty text="No immediate stockout risks." />
        ) : (
          reorder.map(item => (
            <TableRow
              key={item.productId}
              title={item.name}
              subtitle={`Days Until Stockout: ${item.daysUntilStockout}`}
              right={`Risk: ${item.riskLevel}`}
            />
          ))
        )}
      </Section>

      {/* ================= VELOCITY ================= */}
      <Section title="🚀 Velocity Classification">
        {velocity.length === 0 ? (
          <Empty text="No velocity data available." />
        ) : (
          velocity.map(item => (
            <TableRow
              key={item.productId}
              title={item.name}
              subtitle={`Avg Daily Sales: ${item.avgDailySales}`}
              right={item.classification}
            />
          ))
        )}
      </Section>

    </div>
  );
}

/* ---------- REUSABLE UI COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl">
      <h2 className="text-xl font-semibold text-white mb-6">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InsightStat({ label, value, color }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
      <p className="text-xs uppercase text-gray-400 mb-2">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

function TableRow({ title, subtitle, right }) {
  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
      <div className="text-sm text-blue-400 font-medium">
        {right}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <p className="text-gray-400 text-sm">
      {text}
    </p>
  );
}

export default Insights;