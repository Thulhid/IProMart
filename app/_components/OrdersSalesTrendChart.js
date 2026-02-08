"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
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

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const sales = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-zinc-200">
        {label ? format(parseISO(label), "MMM dd, yyyy") : ""}
      </p>
      <p className="mt-1 text-xs text-zinc-400">
        <span className="font-semibold text-zinc-200">
          {formatCurrency(sales)}
        </span>{" "}
        revenue
      </p>
    </div>
  );
}

function OrdersTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const orders = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-zinc-200">
        {label ? format(parseISO(label), "MMM dd, yyyy") : ""}
      </p>
      <p className="mt-1 text-xs text-zinc-400">
        <span className="font-semibold text-zinc-200">{orders}</span> orders
      </p>
    </div>
  );
}

const formatAxisCurrency = (v) =>
  Math.abs(v) >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : Math.abs(v) >= 1_000
      ? `${(v / 1_000).toFixed(0)}k`
      : `${Math.round(v)}`;

export default function OrdersSalesTrendChart({ trend, range }) {
  const data = useMemo(() => buildFullSeries(trend, range), [trend, range]);

  const hasAny = useMemo(
    () => data.some((d) => d.orders > 0 || d.sales > 0),
    [data],
  );

  if (!hasAny) {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
        <h2 className="text-lg font-semibold text-zinc-200">Performance</h2>
        <p className="mt-3 text-center text-xs text-zinc-400">
          No activity to display for the selected range.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {/* Revenue */}
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-200">
              Revenue Trend
            </h2>
            <p className="mt-1 text-xs text-zinc-400">Daily revenue</p>
          </div>
        </div>
        <div className="mt-4 h-[260px] w-full sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
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
              <YAxis
                tickFormatter={formatAxisCurrency}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={{ stroke: "#3f3f46" }}
                width={46}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 8 }}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs font-medium text-zinc-300">
                    {value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-200">
              Orders Trend
            </h2>
            <p className="mt-1 text-xs text-zinc-400">Daily order count</p>
          </div>
        </div>
        <div className="mt-4 h-[260px] w-full sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
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
              <YAxis
                tickFormatter={(v) => `${Math.round(v)}`}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={{ stroke: "#3f3f46" }}
                width={40}
                allowDecimals={false}
              />
              <Tooltip content={<OrdersTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 8 }}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs font-medium text-zinc-300">
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="orders"
                name="Orders"
                fill="#a1a1aa"
                radius={[6, 6, 0, 0]}
                barSize={16}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#e5e7eb"
                strokeWidth={1.8}
                dot={false}
                name="Orders trend"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
