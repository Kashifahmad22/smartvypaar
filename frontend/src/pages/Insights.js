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
      <div className="flex items-center justify-center min-h-[40vh] text-gray-500 dark:text-gray-400">
        Loading Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-14">

      {/* ================= EXECUTIVE SUMMARY ================= */}
      {summary && (
        <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#0f172a] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-lg">

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Business Intelligence
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Operational risk signals, inventory exposure and predictive revenue insights.
            </p>
          </div>

          {/* Core Signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InsightStat label="Stockout Risks" value={summary.stockoutRisks} accent="red" />
            <InsightStat label="Dead Stock" value={summary.deadStockCount} accent="yellow" />
            <InsightStat label="Slow Moving" value={summary.slowMovingCount} accent="blue" />
            <InsightStat label="Fast Moving" value={summary.fastMovingCount} accent="green" />
          </div>

          {/* Financial Exposure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <InsightStat
              label="Inventory Value"
              value={`₹ ${summary.inventoryValue?.toLocaleString()}`}
              accent="purple"
            />
            <InsightStat
              label="Dead Stock Value"
              value={`₹ ${summary.deadStockValue?.toLocaleString()}`}
              accent="red"
            />
            <InsightStat
              label="7-Day Revenue Forecast"
              value={`₹ ${summary.projected7DayRevenue?.toLocaleString()}`}
              accent="emerald"
            />
          </div>

        </div>
      )}

      {/* ================= TOP MARGIN ================= */}
      {summary?.top3MarginProducts?.length > 0 && (
        <Section title="Top Margin Contributors (30 Days)">
          {summary.top3MarginProducts.map((item, index) => (
            <Row
              key={index}
              title={item.name}
              subtitle="30 Day Profit"
              right={`₹ ${item.profit.toLocaleString()}`}
            />
          ))}
        </Section>
      )}

      {/* ================= REORDER ================= */}
      <Section title="Reorder Risk Priority">
        {reorder.length === 0 ? (
          <Empty text="No immediate stockout risks." />
        ) : (
          reorder.map(item => (
            <Row
              key={item.productId}
              title={item.name}
              subtitle={`Stockout in ${item.daysUntilStockout} days`}
              right={item.riskLevel}
            />
          ))
        )}
      </Section>

      {/* ================= VELOCITY ================= */}
      <Section title="Velocity Classification">
        {velocity.length === 0 ? (
          <Empty text="No velocity data available." />
        ) : (
          velocity.map(item => (
            <Row
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

/* ---------- COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight mb-6">
        {title}
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {children}
      </div>
    </div>
  );
}

function InsightStat({ label, value, accent }) {
  const accentMap = {
    red: "text-red-500",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    emerald: "text-emerald-500"
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </p>
      <p className={`text-2xl font-semibold ${accentMap[accent]}`}>
        {value}
      </p>
    </div>
  );
}

function Row({ title, subtitle, right }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition rounded-lg px-2">

      <div>
        <p className="font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {right}
      </div>

    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="py-6 text-gray-500 dark:text-gray-400 text-sm">
      {text}
    </div>
  );
}

export default Insights;