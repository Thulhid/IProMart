"use client";

import { Children, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createPay } from "@/app/_lib/payhere-service";
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
}) {
  const router = useRouter();
  const [isPayHereReady, setIsPayHereReady] = useState(false);
  const [customer, setCustomer] = useState(null);

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
      toast.error("You are not logged in. Please logged in to continue");
      return;
    }

    try {
      const res = await createPay(isCart, customer, includingShipping, {
        item,
        quantity,
      });
      const payhereParams = res.payhereParams;

      window.payhere.onCompleted = function (orderId) {
        toast.success("Payment successful!");
        router.push("/payment/success");
      };

      window.payhere.onDismissed = function () {
        toast.error("Payment dismissed");
      };

      window.payhere.onError = function (error) {
        toast.error("Payment failed: " + error);
        router.push("/payment/cancel");
      };

      window.payhere.startPayment(payhereParams);
    } catch (error) {
      toast.error("Failed to initialize payment");
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
