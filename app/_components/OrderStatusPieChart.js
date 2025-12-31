"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  Pending: "#b91c1c", // red-700
  Processing: "#a16207", // yellow-700
  Shipped: "#1d4ed8", // blue-700
  Delivered: "#15803d", // green-700
  Cancelled: "#3f3f46", // zinc-700
};

function toPercent(count, total) {
  if (!total) return 0;
  return (count / total) * 100;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-zinc-200">{p.status}</p>
      <p className="mt-1 text-xs text-zinc-400">
        <span className="font-semibold text-zinc-200">{p.count}</span> orders
        <span className="ml-2 text-zinc-500">({p.percent.toFixed(1)}%)</span>
      </p>
    </div>
  );
}

function CustomLegend({ payload }) {
  if (!payload?.length) return null;

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {payload.map((entry) => {
        const p = entry?.payload;
        return (
          <Link
            href={`/admin/orders?orderStatus=${p.status}&page=1`}
            key={p.status}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: entry.color }}
              />
              <span className="text-xs font-semibold text-zinc-200">
                {p.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-200">
                {p.count}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function OrderStatusPieChart({ rows }) {
  const { data, total } = useMemo(() => {
    const safe = Array.isArray(rows) ? rows : [];
    const filtered = safe.filter((r) => (r?.count ?? 0) > 0); // ✅ only relevant data
    const t = filtered.reduce((sum, r) => sum + (r?.count ?? 0), 0);

    return {
      total: t,
      data: filtered.map((r) => ({
        status: r.status,
        count: r.count ?? 0,
        percent: toPercent(r.count ?? 0, t),
        color: STATUS_COLORS[r.status] ?? "#71717a", // fallback zinc-500
      })),
    };
  }, [rows]);

  if (!data.length) {
    return (
      <div className="mt-5 rounded-2xl border border-zinc-700 bg-zinc-950/30 p-4">
        <p className="text-center text-xs text-zinc-400">
          No orders in this range to display.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-zinc-700 bg-zinc-950/30 p-4">
      <div>
        <p className="text-xs text-zinc-200">{total} orders</p>
      </div>

      <div className="mt-4 h-[334px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              stroke="transparent"
              labelLine={false}
              // show label only if slice is big enough
              label={({ percent }) =>
                percent >= 0.08 ? `${Math.round(percent)}%` : ""
              }
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              align="center"
              content={<CustomLegend />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
