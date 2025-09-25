"use client";

import Script from "next/script";

export default function PayHereScript() {
  return (
    <Script
      src="https://sandbox.payhere.lk/lib/payhere.js"
      strategy="beforeInteractive"
    />
  );
}
