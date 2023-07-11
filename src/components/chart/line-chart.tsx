import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

export function LineChartComponent() {
  const data = new Array(300).fill(0).map((_, i) => ({
    value: 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="80%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          content={
            <div className="bg-neutral-800 px-4 py-2 rounded-xl shadow text-white/80">
              <span className="text-xs">05/07/2023 23:00 GMT+3</span>
            </div>
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4ade80"
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
