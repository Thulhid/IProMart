"use client";

import { useState } from "react";
import { auth } from "../_lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      setMessage("Sending OTP...");
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        }
      );

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setMessage("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      setMessage(`✅ Phone verified: ${result.user.phoneNumber}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl space-y-4 text-center">
      <h2 className="text-xl font-semibold">Phone Verification</h2>
      <input
        type="tel"
        placeholder="Enter phone number (+9477xxxxxxx)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={sendOtp}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send OTP
      </button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Verify OTP
          </button>
        </>
      )}

      <div id="recaptcha-container"></div>

      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </div>
  );
}
