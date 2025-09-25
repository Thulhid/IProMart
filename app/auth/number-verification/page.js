// pages/phone-login.js
"use client";

import dynamic from "next/dynamic";

const PhoneAuth = dynamic(() => import("../../_components/PhoneAuth"), {
  ssr: false,
});

export default function PhoneLoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <PhoneAuth />
    </main>
  );
}
