import { TrendingUp, AlertTriangle, Activity } from "lucide-react";

function BusinessHealthCard({ data }) {
  if (!data) return null;

  const { score, status, breakdown, business } = data;

  const statusColor =
    status === "Excellent"
      ? "text-green-400"
      : status === "Healthy"
      ? "text-blue-400"
      : status === "Average"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">

      <div className="grid grid-cols-2 gap-12 items-center">

        {/* ================= LEFT SIDE — BUSINESS DETAILS ================= */}
        <div className="space-y-6">

          <h2 className="text-2xl font-bold text-white">
            Business Overview
          </h2>

          <div className="space-y-3 text-sm">

            <DetailRow
              label="Shop Name"
              value={business?.shopName || "—"}
            />

            <DetailRow
              label="Total Products"
              value={business?.totalProducts ?? 0}
            />

            <DetailRow
              label="Low Stock Items"
              value={business?.lowStockCount ?? 0}
            />

            <DetailRow
              label="Expiring Soon"
              value={business?.expiringCount ?? 0}
            />

            <DetailRow
              label="Today's Revenue"
              value={`₹ ${business?.todayRevenue ?? 0}`}
            />

            <DetailRow
              label="Today's Profit"
              value={`₹ ${business?.todayProfit ?? 0}`}
            />

          </div>

        </div>

        {/* ================= RIGHT SIDE — HEALTH SCORE ================= */}
        <div className="text-center space-y-6">

          <h2 className="text-2xl font-bold text-white">
            Business Health
          </h2>

          <div className={`text-6xl font-extrabold ${statusColor}`}>
            {score ?? 0}%
          </div>

          <div className={`text-lg font-semibold ${statusColor}`}>
            {status || "—"}
          </div>

          {/* Breakdown Section */}
          <div className="space-y-3 mt-6 text-sm">

            <BreakdownRow
              icon={<TrendingUp size={16} />}
              label="Profit Contribution"
              value={`${breakdown?.profitComponent ?? 0} pts`}
            />

            <BreakdownRow
              icon={<AlertTriangle size={16} />}
              label="Inventory Health"
              value={`${breakdown?.inventoryComponent ?? 0} pts`}
            />

            <BreakdownRow
              icon={<Activity size={16} />}
              label="Activity Level"
              value={`${breakdown?.activityComponent ?? 0} pts`}
            />

          </div>

        </div>

      </div>
    </div>
  );
}

/* ---------- Detail Row Component ---------- */

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

/* ---------- Breakdown Row Component ---------- */

function BreakdownRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center bg-[#0f172a] border border-gray-800 px-4 py-2 rounded-xl">
      <div className="flex items-center gap-2 text-gray-300">
        {icon}
        {label}
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

export default BusinessHealthCard;