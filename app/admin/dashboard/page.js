"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { parseISO, format } from "date-fns";
import {
  HiCube,
  HiClipboardDocumentList,
  HiCurrencyDollar,
  HiTag,
  HiSquares2X2,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";

import Spinner from "@/app/_components/Spinner";
import Table from "@/app/_components/Table";
import Tag from "@/app/_components/Tag";
import Button from "@/app/_components/Button";
import { getAdminDashboard } from "@/app/_lib/dashboard-service";
import { formatCurrency, formatDistanceFromNow } from "@/app/_utils/helper";
import Link from "next/link";
import HeaderWrapper from "@/app/_components/HeaderWrapper";
import NavBar from "@/app/_components/NavBar";
import AuthPanel from "@/app/_components/AuthPanel";
import { FaMoneyBillWave } from "react-icons/fa6";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-sm shadow-blue-600/10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-400 sm:text-sm">{label}</p>
        <div className="text-zinc-400">{icon}</div>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-200 sm:text-2xl">
        {value ?? 0}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [mode, setMode] = useState("preset"); // "preset" | "custom"
  const [days, setDays] = useState(7);

  const todayStr = new Date().toISOString().slice(0, 10);

  //  Applied range (used for API calls)
  const [from, setFrom] = useState(todayStr);
  const [to, setTo] = useState(todayStr);

  //  Draft range (user edits here; does NOT trigger API calls)
  const [draftFrom, setDraftFrom] = useState(todayStr);
  const [draftTo, setDraftTo] = useState(todayStr);

  const [applyTick, setApplyTick] = useState(0); // trigger fetch for custom

  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res =
          mode === "preset"
            ? await getAdminDashboard({ days })
            : await getAdminDashboard({ from, to });

        setPayload(res?.data);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [mode, days, from, to, applyTick]);

  const rangeTotals = payload?.rangeTotals || {
    products: 0,
    categories: 0,
    coupons: 0,
    orders: 0,
    sales: 0,
  };

  const recentOrders = payload?.recentOrders || [];

  const statusRows = useMemo(() => {
    //  use range-based status counts when available
    const ordersByStatus =
      payload?.rangeOrdersByStatus ?? payload?.ordersByStatus ?? {};

    return ORDER_STATUSES.map((s) => ({
      status: s,
      count: ordersByStatus[s] ?? 0,
    }));
  }, [payload?.rangeOrdersByStatus, payload?.ordersByStatus]);

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      <HeaderWrapper
        rightContent={
          <div className="hidden gap-4 xl:flex">
            <NavBar />
            <AuthPanel />
          </div>
        }
      />

      <div className="mt-30 mb-15 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-300">Dashboard</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            link="/admin/products"
            variant="secondary"
            configStyles="px-3 py-2"
          >
            Products
          </Button>
          <Button
            link="/admin/orders"
            variant="secondary"
            configStyles="px-3 py-2"
          >
            Orders
          </Button>
          <Button
            link="/admin/categories"
            variant="secondary"
            configStyles="px-3 py-2"
          >
            Categories
          </Button>
          <Button
            link="/admin/coupons"
            variant="secondary"
            configStyles="px-3 py-2"
          >
            Coupons
          </Button>
        </div>
      </div>

      <div className="mt-4 ml-auto flex w-fit flex-col gap-3 rounded-2xl sm:flex-row sm:items-center sm:justify-between">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setMode("preset");
                setDays(d);
              }}
              className={`cursor-pointer rounded-xl px-2 text-xs font-medium transition ${
                mode === "preset" && days === d
                  ? "bg-blue-700 text-blue-50"
                  : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Last {d} days
            </button>
          ))}

          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-medium transition ${
              mode === "custom"
                ? "bg-blue-700 text-blue-50"
                : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            Custom
          </button>
        </div>

        {/* Custom range */}
        {mode === "custom" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-400">From</label>
              <input
                type="date"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-400">To</label>
              <input
                type="date"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                //  only now apply to API params
                setFrom(draftFrom);
                setTo(draftTo);
                setApplyTick((x) => x + 1);
              }}
              className="cursor-pointer rounded-lg bg-blue-700 px-2 py-2 text-xs font-semibold text-blue-50 hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="mt-10">
          <Spinner />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              icon={<FaMoneyBillWave size={19} />}
              label="Total sales (Paid)"
              value={formatCurrency(rangeTotals.sales)}
            />
            <StatCard
              icon={<HiClipboardDocumentList size={20} />}
              label="Total orders"
              value={rangeTotals.orders}
            />
            <StatCard
              icon={<HiCube size={20} />}
              label="Total products"
              value={rangeTotals.newProducts}
            />
            <StatCard
              icon={<HiSquares2X2 size={20} />}
              label="Total categories"
              value={rangeTotals.newCategories}
            />
            <StatCard
              icon={<HiTag size={20} />}
              label="Total coupons"
              value={rangeTotals.newCoupons}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_1fr_2fr]">
            {/* Orders by status */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
              <h2 className="text-lg font-semibold text-zinc-200">
                Orders by status
              </h2>
              <div className="mt-4 space-y-2">
                {statusRows.map((row) => (
                  <Link
                    href={`/admin/orders?orderStatus=${row.status}&page=1`}
                    key={row.status}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 hover:border hover:border-blue-600/60"
                  >
                    <Tag status={row.status} />
                    <span className="text-sm font-semibold text-zinc-200">
                      {row.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-200">
                  Recent orders
                </h2>
                <Button
                  link="/admin/orders"
                  variant="secondary"
                  configStyles="px-3 py-2"
                >
                  View all
                </Button>
              </div>

              {recentOrders.length === 0 ? (
                <p className="mt-6 text-sm text-zinc-500">No orders yet.</p>
              ) : (
                <div className="mt-4">
                  <Table>
                    <Table.Header
                      styles="hidden sm:grid gap-2 text-[11px] sm:text-sm uppercase font-semibold
                      grid-cols-[2fr_2.2fr_1.6fr_1.2fr_1.2fr_0.4fr] px-2 py-2 text-zinc-300"
                    >
                      <div>Order ID</div>
                      <div>Customer</div>
                      <div>Date</div>
                      <div>Status</div>
                      <div>Amount</div>
                    </Table.Header>

                    <Table.Body
                      data={recentOrders}
                      render={(o) => (
                        <Table.Row
                          key={o._id}
                          styles="grid gap-2 text-xs sm:text-sm md:text-base items-start border-t border-zinc-700 py-3 px-2
                          grid-cols-2 sm:grid-cols-[2fr_2.2fr_1.6fr_1.2fr_1.2fr_0.4fr]"
                        >
                          <div className="col-span-2 sm:col-span-1">
                            <p className="font-medium text-zinc-200">
                              {o.orderId}
                            </p>
                            <p className="mt-0.5 text-[10px] text-zinc-500 sm:hidden">
                              {format(parseISO(o.createdAt), "MMM dd yyyy")}
                            </p>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-300">
                              {o?.customer
                                ? `${o.customer.firstName} ${o.customer.lastName}`
                                : "-"}
                            </span>
                            <span className="text-[10px] break-words text-zinc-500 sm:text-xs">
                              {o?.customer?.email || ""}
                            </span>
                          </div>

                          <div className="hidden flex-col text-zinc-300 sm:flex">
                            <span>{formatDistanceFromNow(o.createdAt)}</span>
                            <span className="text-[10px] text-zinc-500 sm:text-xs">
                              {format(parseISO(o.createdAt), "MMM dd yyyy")}
                            </span>
                          </div>

                          <Tag status={o.orderStatus} />

                          <div className="text-sm font-semibold text-zinc-200">
                            {formatCurrency(o.totalAmount)}
                          </div>

                          <div className="ml-auto">
                            <Button
                              link={`/admin/orders/${o._id}`}
                              variant="edit"
                              configStyles="p-1"
                            >
                              <HiArrowTopRightOnSquare size={18} />
                            </Button>
                          </div>
                        </Table.Row>
                      )}
                    />
                  </Table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
