"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cancelPay, createPay } from "@/app/_lib/payhere-service";
import Button from "@/app/_components/Button";
import { getCustomer } from "@/app/_lib/customer-service";

export default function PayHereButton({
  isCart = false,
  isLoading,
  includingShipping,
  variant,
  children,
  item,
  configStyles,
  quantity,
  couponCode,
  redeemPoints = 0,
}) {
  const router = useRouter();
  const [isPayHereReady, setIsPayHereReady] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [sessionOrderId, setSessionOrderId] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);

    const checkLoaded = setInterval(() => {
      if (window.payhere?.startPayment) {
        clearInterval(checkLoaded);
        setIsPayHereReady(true);
      }
    }, 200);

    return () => clearInterval(checkLoaded);
  }, []);

  useEffect(() => {
    (async function getCustomerData() {
      try {
        const res = await getCustomer();
        setCustomer(res?.data?.data);
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, []);

  const handlePay = async () => {
    if (!isPayHereReady) {
      toast.error("PayHere SDK is not loaded yet");
      return;
    } else if (!customer) {
      redirect("/auth/login");
    }

    try {
      const res = await createPay(
        isCart,
        customer,
        includingShipping,
        {
          item,
          quantity,
        },
        couponCode,
        redeemPoints,
      );
      const payhereParams = res.payhereParams;
      const orderIdFromSession = payhereParams?.order_id;
      setSessionOrderId(orderIdFromSession || null);

      window.payhere.onCompleted = function (orderId) {
        const oid = orderId || orderIdFromSession;
        toast.success("Payment completed! We are confirming...");
        router.push(
          `/payment/success?orderId=${encodeURIComponent(oid || "")}`,
        );
      };

      window.payhere.onDismissed = async function () {
        const oid = orderIdFromSession;
        toast.error("Payment dismissed");
        if (oid) await cancelPay(oid);
        router.push(`/payment/cancel?orderId=${encodeURIComponent(oid || "")}`);
      };

      window.payhere.onError = async function (error) {
        const oid = orderIdFromSession;
        toast.error("Payment failed: " + error);
        if (oid) await cancelPay(oid);
        router.push(`/payment/cancel?orderId=${encodeURIComponent(oid || "")}`);
      };

      window.payhere.startPayment(payhereParams);
    } catch (error) {
      toast.error("Failed to initialize payment");
      if (sessionOrderId) await cancelPay(sessionOrderId);
    }
  };

  return (
    <Button
      variant={variant}
      configStyles={configStyles}
      onClick={handlePay}
      disabled={!isPayHereReady || isLoading}
    >
      {isPayHereReady ? children : "Loading..."}
    </Button>
  );
}
