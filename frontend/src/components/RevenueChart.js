import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function RevenueChart({ data }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Last 7 Days Revenue
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="#374151"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="_id"
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />

          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#fff"
            }}
            labelStyle={{ color: "#9CA3AF" }}
            itemStyle={{ color: "#4ade80" }}
          />

          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;