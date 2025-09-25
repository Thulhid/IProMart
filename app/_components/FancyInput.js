// components/FancyInput.jsx
import React from "react";

export default function FancyInput({ placeholder, type = "text", ...props }) {
  return (
    <div className="relative inline-flex h-12 w-full max-w-md overflow-hidden rounded-xl p-[2px] group focus-within:outline-none">
      {/* Animated Border */}
      <span className="absolute inset-[-1000%] rounded-xl opacity-0 group-focus-within:opacity-100 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c20008_0%,#e4e4e6_50%,#e7000c_100%)] transition-opacity duration-300" />

      {/* Input Element */}
      <input
        type={type}
        placeholder={placeholder}
        className="relative z-10 h-full w-full rounded-xl bg-zinc-800 px-4 py-2 text-base text-red-50 backdrop-blur-3xl
    placeholder:text-zinc-400
    focus:outline-none transition-colors duration-300 "
        {...props}
      />
    </div>
  );
}
