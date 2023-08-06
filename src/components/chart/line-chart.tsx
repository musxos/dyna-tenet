import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NumberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function LineChartComponent({ data }: any = { data: [] }) {
  const [isClient, setIsClient] = useState(false);
  const [_data, setData] = useState(data);

  useMemo(() => {
    const _data = data.map((item: any) => {
      return {
        name: new Date(item.date).toLocaleTimeString("en-US"),
        value: Number(item.result.Price),
      };
    });

    setData(_data);
  }, [data]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={_data}
            margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dbd4ed" stopOpacity={0.8} />
                <stop offset="80%" stopColor="#dbd4ed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ payload, active, label }) => (
                <div className="bg-secondary px-4 py-2 rounded-xl shadow">
                  <span className="text-xs">
                    {payload &&
                      active &&
                      payload.length &&
                      NumberFormat.format(payload[0].value as number)}
                  </span>
                </div>
              )}
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
              tickFormatter={(value) => NumberFormat.format(value.toFixed(0))}
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
