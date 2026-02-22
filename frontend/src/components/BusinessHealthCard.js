import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function BusinessHealthCard({ data }) {
  if (!data) return null;

  const {
    score,
    status,
    breakdown: {
      profitComponent = 0,
      inventoryComponent = 0,
      expiryComponent = 0,
      activityComponent = 0
    } = {}
  } = data;

  return (
    <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl flex gap-10 items-center">

      {/* Circular Score */}
      <div className="w-32 h-32">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={{
            path: {
              stroke: score > 75 ? "#22c55e" : score > 50 ? "#facc15" : "#ef4444",
              strokeLinecap: "round"
            },
            trail: {
              stroke: "#1f2937"
            },
            text: {
              fill: "#ffffff",
              fontSize: "24px",
              fontWeight: "bold"
            }
          }}
        />
      </div>

      {/* Details */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Business Health
        </h2>

        <p className="text-gray-300 mb-4">
          Status:{" "}
          <span className="text-green-400 font-semibold">
            {status}
          </span>
        </p>

        <div className="space-y-1 text-gray-300 text-sm">
          <p>Profit Score: {profitComponent}</p>
          <p>Inventory Score: {inventoryComponent}</p>
          <p>Expiry Score: {expiryComponent}</p>
          <p>Activity Score: {activityComponent}</p>
        </div>
      </div>

    </div>
  );
}

export default BusinessHealthCard;