// app/_components/PayHereRepairButton.jsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/Button";
import { createRepairPay } from "@/app/_lib/payhere-service";

export default function PayHereRepairButton({
  totalAmount,
  jobId,
  disabled,
  variant = "buy",
  configStyles,
}) {
  const [ready, setReady] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://www.payhere.lk/lib/payhere.js";
    s.async = true;
    document.body.appendChild(s);
    const t = setInterval(() => {
      if (window.payhere?.startPayment) {
        clearInterval(t);
        setReady(true);
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  const handlePay = async () => {
    if (!ready) return toast.error("PayHere SDK not loaded yet");
    try {
      const { payhereParams } = await createRepairPay(jobId, totalAmount);

      window.payhere.onCompleted = function () {
        toast.success("Payment successful!");
        router.push(`/repair-payment/success?repairJobId=${jobId}`);
      };
      window.payhere.onDismissed = function () {
        toast.error("Payment dismissed");
      };
      window.payhere.onError = function (err) {
        toast.error("Payment failed: " + err);
      };

      window.payhere.startPayment(payhereParams);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Button
      variant={variant}
      configStyles={configStyles}
      onClick={handlePay}
      disabled={!ready || disabled}
    >
      {ready ? "Pay Now" : "Loading..."}
    </Button>
  );
}
