import React, { useMemo } from "react";
import {
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend 
} from "recharts";
import type { KPI } from "../types/graphql";

interface TrendChartProps {
  data: KPI[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const chartData = useMemo(() => (data || []).map((d) => ({ ...d })), [data]);

  return (
    <div className="w-full h-64 bg-white rounded-2xl shadow-sm border">
      <div className="p-4 font-medium text-black">Stock vs Demand</div>
      <div className="px-4 pb-4" style={{ width: "100%", height: "220px" }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#000" />
            <YAxis allowDecimals={false} stroke="#000" />
            <Tooltip contentStyle={{ color: "black" }} />
            <Legend />
            <Line type="monotone" dataKey="stock" dot={false} stroke="#1f2937" />
            <Line type="monotone" dataKey="demand" dot={false} stroke="#dc2626" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
