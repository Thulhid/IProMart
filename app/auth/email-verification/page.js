"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import {
  resendEmailVerificationCode,
  verifyEmail,
} from "@/app/_lib/auth-service";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import Button from "@/app/_components/Button";
import { HiCog6Tooth } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { formatTime } from "@/app/_utils/helper";
import MiniSpinner from "@/app/_components/MiniSpinner";

export default function Page() {
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(300);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Resend timer logic
  useEffect(() => {
    if (cooldownTime <= 0) return;
    const interval = setInterval(() => {
      setCooldownTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownTime]);

  // const formatTime = (seconds) => {
  //   const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  //   const s = String(seconds % 60).padStart(2, "0");
  //   return `${m}:${s}`;
  // };

  const handleResend = async () => {
    const email = searchParams.get("email");
    if (!email) return toast.error("Missing email from URL");

    setLoading(true);
    try {
      const res = await resendEmailVerificationCode(email);
      toast.success(res.message);
      setCooldownTime(300); // 5 minutes
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e, index) => {
    const val = e.target.value;
    if (val.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      pasted.split("").forEach((digit, i) => {
        inputsRef.current[i].value = digit;
      });
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const code = inputsRef.current.map((input) => input.value).join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits");
      setLoading(false);
      return;
    }

    const email = searchParams.get("email");
    try {
      const res = await verifyEmail(email, code);
      toast.success(res.message);
      localStorage.setItem("role", "customer");
      router.push("/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerBox>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-zinc-900 shadow-lg shadow-red-600/40 p-8 rounded-2xl border border-zinc-600 text-center"
      >
        <AnimateTitle>
          <IoMdMail />
          Email Verification
        </AnimateTitle>

        <p className="text-zinc-400 text-sm max-w-sm mx-auto">
          We’ve emailed you a 6-digit verification code. Enter it below to
          confirm your email. <br />
          <span className="text-xs">(Valid for only 10 minutes)</span>
        </p>

        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength="1"
              ref={(el) => (inputsRef.current[i] = el)}
              onChange={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={(e) => e.target.select()}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-bold text-zinc-100 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          ))}
        </div>

        <div className="mt-6">
          <Button variant="signup" disabled={loading}>
            {!loading ? (
              "Verify Email"
            ) : (
              <MiniSpinner size={25} configStyles="text-zinc-300" />
            )}
          </Button>
        </div>

        <p className="text-sm text-zinc-500 mt-4">
          Didn’t get the code?{" "}
          {cooldownTime === 0 ? (
            <button
              disabled={loading}
              type="button"
              onClick={handleResend}
              className="text-zinc-200 font-semibold hover:underline cursor-pointer"
            >
              {loading ? "Resending..." : "Resend"}
            </button>
          ) : (
            <span className="text-zinc-400">
              Resend available in{" "}
              <span className="font-medium text-zinc-200">
                {formatTime(cooldownTime)}
              </span>
            </span>
          )}
        </p>
      </form>
    </ContainerBox>
  );
}
