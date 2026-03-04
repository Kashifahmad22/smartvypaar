import { useEffect, useState } from "react";
import api from "../services/api";

import {
  TrendingUp,
  AlertTriangle,
  Shield
} from "lucide-react";

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      {/* EXECUTIVE SUMMARY */}

      {summary && (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm p-6 sm:p-8">

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
              Business Intelligence
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-xl">
              Operational risk signals, inventory exposure and predictive revenue insights.
            </p>
          </div>

          {/* SIGNAL METRICS */}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

            <InsightStat label="Stockout Risks" value={summary.stockoutRisks} />
            <InsightStat label="Dead Stock" value={summary.deadStockCount} />
            <InsightStat label="Slow Moving" value={summary.slowMovingCount} />
            <InsightStat label="Fast Moving" value={summary.fastMovingCount} />

          </div>

          {/* FINANCIAL METRICS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">

            <InsightStat
              label="Inventory Value"
              value={`₹ ${summary.inventoryValue?.toLocaleString()}`}
            />

            <InsightStat
              label="Dead Stock Value"
              value={`₹ ${summary.deadStockValue?.toLocaleString()}`}
            />

            <InsightStat
              label="7-Day Revenue Forecast"
              value={`₹ ${summary.projected7DayRevenue?.toLocaleString()}`}
            />

          </div>

        </div>
      )}

      {/* TOP MARGIN */}

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

      {/* REORDER */}

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

      {/* VELOCITY */}

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


/* SECTION */

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">

      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        {title}
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {children}
      </div>

    </div>
  );
}


/* SUMMARY CARD */

function InsightStat({ label, value }) {

  const greenMetrics = [
    "Inventory Value",
    "7-Day Revenue Forecast"
  ];

  const isGreen = greenMetrics.includes(label);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5">

      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </p>

      <p
        className={`text-xl sm:text-2xl font-semibold ${
          isGreen
            ? "text-green-600 dark:text-green-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ROW */

function Row({ title, subtitle, right }) {

  const renderIndicator = () => {

    if (right === "FAST_MOVING") {
      return (
        <span title="Fast Moving" className="text-green-600">
          <TrendingUp size={18} />
        </span>
      );
    }

    if (right === "HIGH") {
      return (
        <span title="High Risk" className="text-red-500">
          <AlertTriangle size={18} />
        </span>
      );
    }

    if (right === "MEDIUM") {
      return (
        <span title="Medium Risk" className="text-yellow-500">
          <AlertTriangle size={18} />
        </span>
      );
    }

    if (right === "LOW") {
      return (
        <span title="Low Risk" className="text-green-500">
          <Shield size={18} />
        </span>
      );
    }

    return (
      <span className="text-indigo-600 dark:text-indigo-400 text-sm">
        {right}
      </span>
    );
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition rounded-lg px-2">

      <div className="min-w-0 flex-1">

        <p className="font-medium text-gray-900 dark:text-white truncate">
          {title}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>

      </div>

      <div className="flex-shrink-0 flex items-center">
        {renderIndicator()}
      </div>

    </div>
  );
}


/* EMPTY */

function Empty({ text }) {
  return (
    <div className="py-6 text-gray-500 dark:text-gray-400 text-sm">
      {text}
    </div>
  );
}

export default Insights;