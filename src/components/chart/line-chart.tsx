import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function LineChartComponent() {
  const [isClient, setIsClient] = useState(false);

  const data = new Array(12).fill(0).map((_, i) => ({
    value: i + 100,
    name: Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(new Date(Date.now() + i * 1000 * 60 * 60 * 24 * 30)),
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dbd4ed" stopOpacity={0.8} />
                <stop offset="80%" stopColor="#dbd4ed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={
                <div className="bg-secondary px-4 py-2 rounded-xl shadow">
                  <span className="text-xs">05/07/2023 23:00 GMT+3</span>
                </div>
              }
            />
            <XAxis
              tick={{
                fill: "#252525",
              }}
              tickLine={false}
              axisLine={false}
              dataKey="name"
              type="category"
            />
            <YAxis
              tick={{
                fill: "#252525",
              }}
              axisLine={false}
              tickLine={false}
              type="number"
              dataKey="value"
              domain={["auto", "auto"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#9c7fdb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
