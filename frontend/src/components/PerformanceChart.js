import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";

function PerformanceChart({ data = [], metric = "revenue" }) {
  const [isDark, setIsDark] = useState(false);

  // Detect theme from HTML class
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const lineColor =
    metric === "revenue"
      ? "#16a34a" // green
      : "#3b82f6"; // blue

  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="h-[350px] w-full">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>

          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="label"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
          />

          <YAxis
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "12px"
            }}
            labelStyle={{ color: textColor }}
          />

          <Line
            type="monotone"
            dataKey={metric}
            stroke={lineColor}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PerformanceChart;