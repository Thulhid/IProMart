"use client";

import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/app/_utils/helper";

export default function PointsRedeemer({
  isLoggedIn,
  pointsInfo,
  pointsSettings,
  subtotalAmount,
  couponDiscountAmount,
  appliedCouponCode,
  redeemPoints,
  onChangeRedeemPoints,
}) {
  const settings = pointsInfo?.settings || pointsSettings || {};
  const pointsEnabled = Boolean(settings.pointsEnabled);
  const allowPointsWithCoupon = Boolean(settings.allowPointsWithCoupon);

  const pointValueRs = Number(settings.pointValueRs ?? 1);
  const maxRedeemPercent = Number(settings.maxRedeemPercent ?? 0);
  const minRedeemPoints = Number(settings.minRedeemPoints ?? 0);

  const balancePoints = Number(pointsInfo?.balancePoints ?? 0);
  const pendingPoints = Number(pointsInfo?.pendingPoints ?? 0);
  const reservedPoints = Number(pointsInfo?.reservedPoints ?? 0);
  const thresholdRemaining = Math.max(0, minRedeemPoints - balancePoints);
  const lockedByThreshold = thresholdRemaining > 0;

  const redeemBase = Math.max(
    0,
    Number(subtotalAmount) - Number(couponDiscountAmount || 0),
  );

  const maxPointsThisOrder = useMemo(() => {
    if (!pointsEnabled) return 0;
    if (lockedByThreshold) return 0;
    if (!redeemBase || maxRedeemPercent <= 0 || pointValueRs <= 0) return 0;

    const maxDiscount = (redeemBase * maxRedeemPercent) / 100;
    const byPercent = Math.floor(maxDiscount / pointValueRs);

    const capped = Math.max(0, Math.min(balancePoints, byPercent));
    return capped;
  }, [
    pointsEnabled,
    lockedByThreshold,
    redeemBase,
    maxRedeemPercent,
    pointValueRs,
    balancePoints,
  ]);

  const pointsToUse = Math.max(
    0,
    Math.min(Number(redeemPoints || 0), maxPointsThisOrder),
  );
  const pointsDiscountAmount = pointsToUse * pointValueRs;

  useEffect(() => {
    if (redeemPoints > maxPointsThisOrder) {
      onChangeRedeemPoints(maxPointsThisOrder);
    }
  }, [redeemPoints, maxPointsThisOrder, onChangeRedeemPoints]);

  useEffect(() => {
    if (!allowPointsWithCoupon && appliedCouponCode && pointsToUse > 0) {
      onChangeRedeemPoints(0);
      toast("Points removed because a coupon is applied");
    }
  }, [
    allowPointsWithCoupon,
    appliedCouponCode,
    pointsToUse,
    onChangeRedeemPoints,
  ]);

  if (!isLoggedIn) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 p-3 text-sm text-zinc-400">
        Login to use loyalty points.
      </div>
    );
  }

  if (!pointsEnabled) return null;

  const blockedByCoupon = Boolean(appliedCouponCode) && !allowPointsWithCoupon;
  const disableRedeemControls = blockedByCoupon || lockedByThreshold;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950/40 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-200">Use Points</p>
        <p className="text-xs text-zinc-400">
          Available: <span className="text-zinc-200">{balancePoints}</span>
          {pendingPoints > 0 && (
            <>
              {" "}
              • Pending: <span className="text-zinc-200">{pendingPoints}</span>
            </>
          )}
          {reservedPoints > 0 && (
            <>
              {" "}
              • Reserved: <span className="text-zinc-200">{reservedPoints}</span>
            </>
          )}
        </p>
      </div>

      <p className="mt-1 text-xs text-zinc-500">
        Max this order:{" "}
        <span className="text-zinc-200">{maxPointsThisOrder}</span> • Worth:{" "}
        <span className="text-zinc-200">
          {formatCurrency(pointsDiscountAmount)}
        </span>
      </p>

      {lockedByThreshold && (
        <p className="mt-2 text-xs text-yellow-400">
          Need {thresholdRemaining} more points to unlock.
        </p>
      )}

      {blockedByCoupon ? (
        <p className="mt-2 text-xs text-yellow-400">
          Remove coupon to use points (stacking disabled).
        </p>
      ) : (
        <>
          <input
            type="range"
            min={0}
            max={maxPointsThisOrder}
            step={1}
            value={pointsToUse}
            disabled={disableRedeemControls}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChangeRedeemPoints(v);
            }}
            className="mt-3 w-full"
          />

          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={maxPointsThisOrder}
              step={1}
              value={pointsToUse}
              disabled={disableRedeemControls}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isNaN(v)) return onChangeRedeemPoints(0);
                onChangeRedeemPoints(Math.min(Math.max(0, v), maxPointsThisOrder));
              }}
              className="input w-28"
            />

            <button
              type="button"
              className="rounded-md bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
              onClick={() => onChangeRedeemPoints(maxPointsThisOrder)}
              disabled={disableRedeemControls || maxPointsThisOrder <= 0}
            >
              Max
            </button>

            <button
              type="button"
              className="rounded-md bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
              onClick={() => onChangeRedeemPoints(0)}
              disabled={disableRedeemControls}
            >
              Clear
            </button>
          </div>

          {pointsToUse > 0 && pointsToUse < minRedeemPoints && (
            <p className="mt-2 text-xs text-yellow-400">
              Minimum redeem is {minRedeemPoints} points.
            </p>
          )}
        </>
      )}
    </div>
  );
}
