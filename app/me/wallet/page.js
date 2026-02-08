"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ContainerBox from "@/app/_components/ContainerBox";
import BackButton from "@/app/_components/BackButton";
import Spinner from "@/app/_components/Spinner";
import Button from "@/app/_components/Button";

import { getMyPoints } from "@/app/_lib/points-service";
import { formatCurrency, formatDistanceFromNow } from "@/app/_utils/helper";

import {
  HiOutlineChevronLeft,
  HiOutlineWallet,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowDownLeft,
  HiOutlineArrowUpRight,
  HiOutlineSparkles,
  HiOutlineReceiptRefund,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

function StatusPill({ status }) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold";

  if (status === "Active")
    return (
      <span
        className={`${base} border-green-500/30 bg-green-500/10 text-green-300`}
      >
        <HiOutlineCheckCircle size={14} />
        Active
      </span>
    );

  if (status === "Pending")
    return (
      <span
        className={`${base} border-yellow-500/30 bg-yellow-500/10 text-yellow-300`}
      >
        <HiOutlineClock size={14} />
        Pending
      </span>
    );

  return (
    <span className={`${base} border-red-500/30 bg-red-500/10 text-red-300`}>
      <HiOutlineXCircle size={14} />
      Cancelled
    </span>
  );
}

function txnUI(txn) {
  const type = txn?.type;

  const isPlus = type === "Earn" || type === "ReverseRedeem";
  const isMinus =
    type === "Redeem" || type === "ReverseEarn" || type === "Expire";

  let sign = "";
  if (isPlus) sign = "+";
  if (isMinus) sign = "-";

  let title = "Activity";
  let icon = <HiOutlineSparkles size={18} className="text-zinc-300" />;

  if (type === "Earn") {
    title = "Earned points";
    icon = <HiOutlineArrowDownLeft size={18} className="text-blue-300" />;
  } else if (type === "Redeem") {
    title = "Redeemed points";
    icon = <HiOutlineArrowUpRight size={18} className="text-purple-300" />;
  } else if (type === "ReverseRedeem") {
    title = "Points returned";
    icon = <HiOutlineReceiptRefund size={18} className="text-green-300" />;
  } else if (type === "ReverseEarn") {
    title = "Earn reversed";
    icon = <HiOutlineReceiptRefund size={18} className="text-red-300" />;
  } else if (type === "Expire") {
    title = "Points expired";
    icon = (
      <HiOutlineExclamationTriangle size={18} className="text-yellow-300" />
    );
  }

  return { sign, title, icon };
}

function buildThreshold(available, minRedeemPoints) {
  if (!minRedeemPoints) {
    return { enabled: false, unlocked: true, progress: 100, remaining: 0 };
  }
  const progress = Math.min(
    100,
    Math.round((available / minRedeemPoints) * 100),
  );
  const remaining = Math.max(0, minRedeemPoints - available);
  return {
    enabled: true,
    unlocked: available >= minRedeemPoints,
    progress,
    remaining,
  };
}

export default function WalletPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pointsInfo, setPointsInfo] = useState(null);

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const p = await getMyPoints();
        if (!p) {
          router.push("/auth/login");
          return;
        }
        setPointsInfo(p);
      } catch (err) {
        toast.error(err.message || "Failed to load wallet");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  if (isLoading) return <Spinner />;

  if (!pointsInfo)
    return (
      <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
        <p className="py-20 text-center text-base text-zinc-400 sm:text-lg">
          Wallet not available.
        </p>
      </div>
    );

  const settings = pointsInfo?.settings || {};
  const pointsEnabled = Boolean(settings.pointsEnabled);

  const available = Number(pointsInfo.balancePoints || 0);
  const pending = Number(pointsInfo.pendingPoints || 0);
  const reserved = Number(pointsInfo.reservedPoints || 0);

  const pointValueRs = Number(settings.pointValueRs ?? 1);
  const capPercent = Number(settings.maxRedeemPercent ?? 20);

  const minRedeemPoints = Number(
    settings.minRedeemPoints ?? settings.pointsMinRedeemPoints ?? 0,
  );

  const totalVisible = available + pending + reserved;
  const availableValue = available * pointValueRs;

  const threshold = buildThreshold(available, minRedeemPoints);

  const recent = Array.isArray(pointsInfo.recent) ? pointsInfo.recent : [];

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>

        <div className="flex items-center gap-3">
          <HiOutlineWallet className="text-blue-300" size={26} />
          <h1 className="text-2xl font-semibold text-zinc-300 sm:text-3xl">
            My Wallet
          </h1>
        </div>
      </div>

      <ContainerBox>
        <div className="w-full max-w-5xl space-y-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 shadow-lg shadow-blue-600/40 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-zinc-400">Loyalty Points</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {pointsEnabled ? `${available} available` : "Disabled"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Value now:{" "}
                <span className="font-semibold text-zinc-200">
                  {formatCurrency(availableValue)}
                </span>{" "}
                <span className="text-zinc-500">
                  (1 point =
                  {formatCurrency(pointValueRs).replace("Rs. ", "Rs. ")})
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" link="/products">
                Shop Now
              </Button>
              <Button variant="secondary" link="/me/orders">
                My Orders
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
              <p className="text-xs text-zinc-400">Available</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {available}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Spendable at checkout
              </p>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
              <p className="text-xs text-zinc-400">Pending</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {pending}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Unlocks after Delivered
              </p>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
              <p className="text-xs text-zinc-400">Reserved</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {reserved}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Locked in payment session
              </p>
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
              <p className="text-xs text-zinc-400">Total (visible)</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {totalVisible}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Available + Pending + Reserved
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-200">
                  Redemption Threshold
                </p>
                {!threshold.enabled ? (
                  <span className="text-xs text-zinc-400">No minimum</span>
                ) : threshold.unlocked ? (
                  <span className="text-xs font-semibold text-green-300">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-yellow-300">
                    Need {threshold.remaining} more
                  </span>
                )}
              </div>

              {!threshold.enabled ? (
                <p className="mt-2 text-xs text-zinc-500">
                  You can redeem points as long as you have available balance and
                  your order cap allows it.
                </p>
              ) : (
                <>
                  <p className="mt-2 text-xs text-zinc-400">
                    Unlock at{" "}
                    <span className="font-semibold text-zinc-200">
                      {minRedeemPoints}
                    </span>{" "}
                    available points
                  </p>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${threshold.progress}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {available} / {minRedeemPoints}
                    </span>
                    <span>{threshold.progress}%</span>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
              <p className="text-sm font-semibold text-zinc-200">Wallet Rules</p>

              <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Point value</span>
                  <span className="font-semibold text-zinc-100">
                    1 point = {formatCurrency(pointValueRs)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Max redeem per order</span>
                  <span className="font-semibold text-zinc-100">
                    {capPercent}%
                  </span>
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Tip: Pending points become available after your order is
                  delivered.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-200">
                Recent Activity
              </p>
              <p className="text-xs text-zinc-500">
                Last {Math.min(20, recent.length)}
              </p>
            </div>

            {recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-400">
                No points activity yet. Buy something to start earning points.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-zinc-700/60">
                {recent.map((txn) => {
                  const { sign, title, icon } = txnUI(txn);
                  const pts = Number(txn.points || 0);
                  const status = txn.status || "Pending";
                  const createdAt = txn.createdAt;

                  return (
                    <div
                      key={txn._id || txn.id}
                      className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
                          {icon}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-zinc-100">
                              {title}
                            </p>
                            <StatusPill status={status} />
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {txn.orderCode ? (
                              <>
                                Order:{" "}
                                <span className="text-zinc-300">
                                  {txn.orderCode}
                                </span>{" "}
                                •{" "}
                              </>
                            ) : null}
                            {createdAt ? formatDistanceFromNow(createdAt) : "—"}
                          </p>

                          {txn.note ? (
                            <p className="mt-1 text-xs text-zinc-400">
                              {txn.note}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
                        <p className="text-lg font-semibold text-zinc-100">
                          {sign}
                          {pts}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatCurrency(pts * pointValueRs)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ContainerBox>
    </div>
  );
}
