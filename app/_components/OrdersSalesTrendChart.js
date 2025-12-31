"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { format, parseISO, addDays } from "date-fns";
import { formatCurrency } from "@/app/_utils/helper";

function buildFullSeries(trend, range) {
  const map = new Map((trend ?? []).map((d) => [d.date, d]));

  if (!range?.start || !range?.end) return trend ?? [];

  const start = new Date(range.start);
  const end = new Date(range.end);

  // normalize to date-only loop
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const out = [];
  for (let d = startDay; d <= endDay; d = addDays(d, 1)) {
    const key = format(d, "yyyy-MM-dd");
    const found = map.get(key);
    out.push({
      date: key,
      orders: found?.orders ?? 0,
      sales: found?.sales ?? 0,
    });
  }
  return out;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const sales = payload.find((p) => p.dataKey === "sales")?.value ?? 0;
  const orders = payload.find((p) => p.dataKey === "orders")?.value ?? 0;

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-zinc-200">
        {label ? format(parseISO(label), "MMM dd, yyyy") : ""}
      </p>
      <div className="mt-1 space-y-1 text-xs text-zinc-400">
        <p>
          <span className="font-semibold text-zinc-200">
            {formatCurrency(sales)}
          </span>{" "}
          sales
        </p>
        <p>
          <span className="font-semibold text-zinc-200">{orders}</span> orders
        </p>
      </div>
    </div>
  );
}

export default function OrdersSalesTrendChart({ trend, range }) {
  const data = useMemo(() => buildFullSeries(trend, range), [trend, range]);

  const hasAny = useMemo(
    () => data.some((d) => d.orders > 0 || d.sales > 0),
    [data],
  );

  if (!hasAny) {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
        <h2 className="text-lg font-semibold text-zinc-200">
          Sales & Orders Trend
        </h2>
        <p className="mt-3 text-center text-xs text-zinc-400">
          No activity to display for the selected range.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-200">
            Sales & Orders Trend
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Daily totals (selected range)
          </p>
        </div>
      </div>

      <div className="mt-4 h-[280px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 26, right: 18, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => format(parseISO(v), "MMM d")}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
              minTickGap={18}
            />

            {/* Sales axis (left) */}
            <YAxis
              yAxisId="sales"
              tickFormatter={(v) => (v ? `${Math.round(v)}` : "0")}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
              width={50}
            />

            {/* Orders axis (right) */}
            <YAxis
              yAxisId="orders"
              orientation="right"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={{ stroke: "#3f3f46" }}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 12 }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs font-medium text-zinc-300">
                  {value}
                </span>
              )}
            />

            {/* Sales (blue-700) */}
            <Area
              yAxisId="sales"
              type="monotone"
              dataKey="sales"
              stroke="#1d4ed8"
              fill="#1d4ed8"
              fillOpacity={0.18}
              strokeWidth={2}
              dot={false}
              name="Sales"
            />

            {/* Orders (zinc-200-ish line) */}
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#a1a1aa"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
              name="Orders"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
