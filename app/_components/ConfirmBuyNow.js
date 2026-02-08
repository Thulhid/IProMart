"use client";

import { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { getSetting } from "@/app/_lib/setting-service";
import { formatCurrency } from "@/app/_utils/helper";
import PayHereButton from "@/app/_components/PayHereButton";
import Button from "@/app/_components/Button";
import toast from "react-hot-toast";
import { quoteItemCoupon } from "@/app/_lib/coupon-service";
import { getMyPoints } from "@/app/_lib/points-service";
import PointsRedeemer from "@/app/_components/PointsRedeemer";

function ConfirmBuyNow({ product, currentQuantity }) {
  const [shippingFee, setShippingFee] = useState(null);
  const [settings, setSettings] = useState(null);
  const [includingShipping, setIncludingShipping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [pointsInfo, setPointsInfo] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(0);

  function removeCoupon() {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return toast.error("Enter a coupon code");

    const toastId = toast.loading("Applying coupon...");
    setIsApplyingCoupon(true);
    try {
      const data = await quoteItemCoupon(
        code,
        includingShipping,
        product._id,
        currentQuantity,
      );
      if (!data?.coupon?.valid) {
        setAppliedCoupon(null);
        setDiscountAmount(0);

        const reason = data?.coupon?.reason;
        if (reason === "MIN_NOT_MET") {
          toast.error("Total is not enough for this coupon", {
            id: toastId,
          });
          return;
        }
        if (reason === "NOT_FOUND") {
          toast.error("Invalid coupon code", { id: toastId });
          return;
        }

        toast.error("Coupon not applicable", { id: toastId });
        return;
      }
      setAppliedCoupon(data.coupon.code);
      setDiscountAmount(Number(data.discountAmount || 0));
      toast.success(`Coupon applied: ${data.coupon.code}`, { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to apply coupon", { id: toastId });
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  useEffect(() => {
    removeCoupon();
  }, [includingShipping]);

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const res = await getSetting();
        setShippingFee(res.data.data.shippingFee);
        setSettings(res.data.data || null);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const p = await getMyPoints();
        setPointsInfo(p);
      } catch (err) {
        toast.error(err.message || "Failed to load points info");
        setPointsInfo(null);
        setRedeemPoints(0);
      }
    })();
  }, []);

  const baseTotal = includingShipping
    ? product.finalPrice * currentQuantity + shippingFee
    : product.finalPrice * currentQuantity;

  const pointsSettings = pointsInfo?.settings || settings || {};
  const pointValueRs = Number(pointsSettings.pointValueRs ?? 1);
  const maxRedeemPercent = Number(pointsSettings.maxRedeemPercent ?? 0);
  const pointsEnabled = Boolean(pointsSettings.pointsEnabled);
  const balancePoints = Number(pointsInfo?.balancePoints ?? 0);

  const redeemBase = Math.max(
    0,
    product.finalPrice * currentQuantity - (discountAmount || 0),
  );
  const maxDiscountByPercent = pointsEnabled
    ? (redeemBase * maxRedeemPercent) / 100
    : 0;
  const maxPointsByPercent =
    pointsEnabled && pointValueRs > 0
      ? Math.floor(maxDiscountByPercent / pointValueRs)
      : 0;

  const maxPointsThisOrder = Math.max(
    0,
    Math.min(balancePoints, maxPointsByPercent),
  );
  const pointsToUse = Math.max(0, Math.min(redeemPoints, maxPointsThisOrder));
  const pointsDiscountAmount = pointsToUse * pointValueRs;

  const total = Math.max(
    0,
    baseTotal - (discountAmount || 0) - (pointsDiscountAmount || 0),
  );

  return (
    <div className="w-full max-w-md space-y-4 bg-zinc-900 px-6 py-5">
      <h3 className="text-lg font-semibold text-zinc-100 sm:text-xl">
        Confirm Payment Option
      </h3>

      <div className="flex items-start gap-3 text-zinc-200">
        <input
          type="checkbox"
          id="includeShipping"
          checked={includingShipping}
          onChange={() => setIncludingShipping((prev) => !prev)}
          className="mt-1 h-5 w-5 accent-red-600"
        />
        <label htmlFor="includeShipping" className="cursor-pointer">
          Include Shipping Fee ({formatCurrency(shippingFee)})
        </label>
      </div>
      <div className="my-5 flex flex-col items-start gap-2 sm:items-center">
        <label className="text-sm text-zinc-300">Coupon Code</label>

        <div className="flex w-full gap-2">
          <input
            type="text"
            className="input w-full"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter code"
          />
          <Button
            variant={"secondary"}
            onClick={handleApplyCoupon}
            disabled={isApplyingCoupon}
            className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60"
          >
            {isApplyingCoupon ? "Applying..." : "Apply"}
          </Button>
        </div>
      </div>

      {appliedCoupon && discountAmount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-400">Applied: {appliedCoupon}</span>
          <button
            type="button"
            className="text-zinc-300 underline"
            onClick={removeCoupon}
          >
            Remove
          </button>
        </div>
      )}
      {discountAmount > 0 && (
        <div className="flex justify-between text-sm text-zinc-300">
          <span>Coupon Discount:</span>
          <span>- {formatCurrency(discountAmount)}</span>
        </div>
      )}

      <PointsRedeemer
        isLoggedIn={true}
        pointsInfo={pointsInfo}
        pointsSettings={pointsSettings}
        subtotalAmount={product.finalPrice * currentQuantity}
        couponDiscountAmount={discountAmount}
        appliedCouponCode={appliedCoupon}
        redeemPoints={redeemPoints}
        onChangeRedeemPoints={(v) => {
          const allow = Boolean(pointsSettings.allowPointsWithCoupon);
          if (!allow && appliedCoupon && v > 0) {
            removeCoupon();
            toast("Coupon removed because points are used");
          }
          setRedeemPoints(v);
        }}
      />

      {!includingShipping && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-600 bg-yellow-500/10 p-3 text-sm text-yellow-400">
          <HiOutlineInformationCircle
            className="mt-0.5 min-w-[20px]"
            size={20}
          />
          <span>
            Shipping fee ({formatCurrency(shippingFee)}) will be collected when
            your order is delivered
          </span>
        </div>
      )}
      <PayHereButton
        variant="primary"
        isLoading={isLoading}
        includingShipping={includingShipping}
        item={product}
        quantity={currentQuantity}
        configStyles="ml-auto !text-base"
        couponCode={appliedCoupon}
        redeemPoints={pointsToUse}
      >
        Confirm
      </PayHereButton>

      <div className="mt-4 border-t border-zinc-700 pt-1 text-base text-zinc-300">
        <p>
          Total payable now:{" "}
          {/* <span className="font-medium text-white">
            {includingShipping
              ? formatCurrency(
                  product.finalPrice * currentQuantity + shippingFee,
                )
              : formatCurrency(product.finalPrice * currentQuantity)}
          </span> */}
          {total}
        </p>
      </div>
    </div>
  );
}

export default ConfirmBuyNow;
